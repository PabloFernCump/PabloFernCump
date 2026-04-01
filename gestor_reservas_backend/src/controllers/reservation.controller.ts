//Controller de reservas (HTTP)

import { Request, Response } from 'express'; 
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  createNewReservation,
  listUserReservations,
  cancelUserReservation,
  getAvailableSlots,
  updateReservationStatus // <--- IMPORTANTE: Asegúrate de que está en el service
} from '../services/reservation.service';

import Stripe from 'stripe';
import { sendReservationEmail } from '../services/email.service'; // Nos aseguramos de que la ruta es correcta

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

/**
 * NUEVO: Consulta los huecos libres según el deporte y la fecha seleccionada.
 * GET /api/reservations/availability?sport=Padel&date=2024-10-10
 */
export const getAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { sport, date } = req.query;

    if (!sport || !date) {
      return res.status(400).json({ message: 'Faltan parámetros: sport y date' });
    }

    const availability = await getAvailableSlots(String(sport), String(date));
    res.json(availability);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Gestiona la creación de una nueva reserva.
 * Extrae el ID del usuario del token JWT para asegurar la identidad.
 */
export const createReservation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email; // <--- Ahora lo tenemos disponible

    // 1. Creamos la reserva en la DB (Estado inicial: 'pending')
    const result = await createNewReservation(userId, req.body);

    // 2. Generamos la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { 
            name: `Reserva ${req.body.sport}`,
            description: `${req.body.date} a las ${req.body.hour}:00h` 
          },
          unit_amount: 2000, // 20€
        },
        quantity: 1,
      }],
      mode: 'payment',
      /**
       * EXPLICACIÓN DEL CAMBIO:
       * Guardamos TODA la información en la metadata. 
       * Stripe guardará esto y nos lo devolverá en el Webhook cuando el pago termine.
       * Esto es lo que permite que el archivo .ics tenga datos reales.
       */
      metadata: { 
        reservationId: String(result.id),
        userEmail: userEmail,
        sport: req.body.sport,
        date: req.body.date,
        hour: String(req.body.hour || req.body.time || '10'), // Fallback a las 10 si no hay nada        courtName: `Pista ${req.body.courtId || 'Seleccionada'}`
      }, 
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    /**
     * EXPLICACIÓN DEL FIX PARA EL EMAIL:
     * Creamos un objeto 'emailData' mapeando los nombres de tu req.body 
     * a los nombres que espera el servicio de email (sport, date, courtName, hour).
     * Esto soluciona los "undefined" en el correo.
     */
    const emailData = {
      sport: req.body.sport,
      date: req.body.date,
      courtName: `Pista ${req.body.courtId || 'Seleccionada'}`, 
      hour: req.body.time || req.body.hour 
    };

    /**
     * EXPLICACIÓN DEL FIX DE TYPESCRIPT (Error image_d675e0):
     * Usamos 'session.url || undefined' porque Stripe puede devolver null, 
     * pero nuestra función de email solo acepta string o undefined.
     */
    // 3. Enviamos el Mail de "Pendiente" (No ponemos 'await' para no hacer esperar al usuario)
    sendReservationEmail(
      userEmail, 
      emailData, // Pasamos los datos limpios aquí
      'PENDING',
      session.url || undefined // <--- Pasamos la URL de Stripe al email con el fix de TS
    ).catch(console.error);

    // 4. IMPORTANTE: Enviamos la URL de Stripe al Frontend
    res.status(201).json({ 
      ...result, 
      url: session.url // El frontend usará esto para redirigir
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * NUEVO: Webhook de Stripe para confirmar el pago.
 * Usamos 'req: any' para evitar conflictos de tipos con las cabeceras en Windows/TS.
 */
export const stripeWebhook = async (req: any, res: Response) => {
  // Leemos la firma de seguridad que envía Stripe
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verificamos que el evento es auténtico usando nuestra clave secreta del .env
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig!, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`❌ Error de validación Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Si el pago se ha completado con éxito en la plataforma de Stripe
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Recuperamos los datos que inyectamos en el paso de creación (createReservation)
    const reservationId = session.metadata?.reservationId;
    const userEmail = session.metadata?.userEmail;

    try {
      // 1. Actualizamos el estado en la DB a 'CONFIRMED' usando el Service
      await updateReservationStatus(Number(reservationId), 'confirmed');

      /**
       * EXPLICACIÓN DEL FIX:
       * Ahora recuperamos los datos reales de la metadata que guardamos antes.
       * Esto hará que el email de confirmación tenga la fecha y hora correctas
       * para generar el archivo .ics sin errores de "NaN".
       */

      const rawHour = session.metadata?.hour || '10';
      const cleanHour = rawHour.includes(':') ? rawHour.split(':')[0] : rawHour;
      const confirmedData = {
        sport: session.metadata?.sport || 'Deporte',
        date: session.metadata?.date || '',
        courtName: session.metadata?.courtName || 'Pista',
        hour: cleanHour // Enviamos la hora ya limpia
      };

      // 2. Enviamos el email de confirmación definitiva al cliente
      await sendReservationEmail(
        userEmail!, 
        confirmedData, 
        'CONFIRMED'
      );
      
      console.log(`✅ ¡Pago verificado! Reserva ${reservationId} actualizada a CONFIRMED.`);
    } catch (dbError) {
      console.error("Error en Webhook:", dbError);
    }
  }

  // Notificamos a Stripe que el evento se procesó correctamente (Status 200)
  res.json({ received: true });
};

/**
 * Obtiene todas las reservas del usuario que hace la petición.
 */
export const getMyReservations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const reservations = await listUserReservations(userId);
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
};

/**
 * Cancela una reserva específica verificando que pertenezca al usuario.
 */
export const cancelReservation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const reservationId = Number(req.params.id);
    
    const result = await cancelUserReservation(reservationId, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'No se encontró la reserva o no tienes permiso para cancelarla' 
      });
    }

    res.json({ message: 'Reserva cancelada correctamente' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};