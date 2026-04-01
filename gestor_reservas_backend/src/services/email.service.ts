import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import * as ics from 'ics'; // <--- NUEVA LIBRERÍA

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- NUEVA FUNCIÓN AUXILIAR: Generador de enlace Google Calendar ---
const getGoogleCalendarUrl = (res: any) => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  // Formateamos la fecha de YYYY-MM-DD a YYYYMMDD
  const dateClean = res.date.replace(/-/g, '');
  
  // Google necesita: YYYYMMDDTHHMMSS (Asumimos 1 hora de duración)
  const startHour = String(res.hour).padStart(2, '0');
  const endHour = String(Number(res.hour) + 1).padStart(2, '0');
  
  const startTime = `${dateClean}T${startHour}0000`;
  const endTime = `${dateClean}T${endHour}0000`;

  return `${baseUrl}&text=Reserva+de+${res.sport.replace(/ /g, '+')}&dates=${startTime}/${endTime}&details=Tu+reserva+en+el+Club+Deportivo&location=Pista+${res.courtName ||
     'Seleccionada'}`;
};

// Función genérica para enviar correos
export const sendReservationEmail = async (
  userEmail: string, 
  reservation: any, 
  type: 'PENDING' | 'CONFIRMED',
  paymentUrl?: string // <--- NUEVO: Añadimos este parámetro para recibir la URL de Stripe
) => {
  
  const isConfirmed = type === 'CONFIRMED';
  let attachments: any[] = [];
  let icsContent = '';

  // --- LÓGICA PARA APPLE / OUTLOOK (.ics) ---
  if (isConfirmed) {
    try {
      // 1. Limpiamos y aseguramos que los números sean NÚMEROS
      const dateParts = reservation.date.split('-').map((n: string) => parseInt(n, 10));
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const hour = parseInt(reservation.hour, 10);

      // VALIDACIÓN: Si alguno de estos no es un número válido, no intentamos crear el ICS
      if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour)) {
        const event: ics.EventAttributes = {
          start: [year, month, day, hour, 0], 
          duration: { hours: 1 },
          title: `Reserva de ${reservation.sport}`,
          description: `Reserva confirmada en el Club Deportivo.`,
          location: `Pista ${reservation.courtName || 'Principal'}`,
          status: 'CONFIRMED',
          busyStatus: 'BUSY',
          productId: 'club-deportivo/reserva'
        };

        const { error, value } = ics.createEvent(event);
        
        if (error) {
          console.error("❌ Error detallado de la librería ICS:", JSON.stringify(error, null, 2));
        }

        if (value) {
          icsContent = value;
          attachments.push({
            filename: 'reserva-pista.ics',
            content: value,
            // CAMBIO IMPORTANTE: Añadimos el método REQUEST para que iOS lo detecte como evento
            contentType: 'text/calendar; charset=utf-8; method=REQUEST',
          });
        }
      }
    } catch (err) {
      console.error("❌ Error crítico en la lógica del adjunto:", err);
    }
  }

  // --- DEFINICIÓN ÚNICA DE mailOptions (ESTILO PROFESIONAL) ---
  // Usamos 'any' para evitar errores de TS con la propiedad 'alternatives'
  const mailOptions: any = {
    from: `"Club Deportivo La Fortuna 🎾" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: isConfirmed ? '✅ ¡Reserva Confirmada y Pagada!' : '⏳ Reserva Recibida - Pendiente de Pago',
    attachments: attachments, 
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center; background-color: ${isConfirmed ? '#27ae60' : '#f39c12'}; color: white; padding: 15px; border-radius: 8px;">
          <h2 style="margin: 0;">${isConfirmed ? '¡Todo listo!' : 'Reserva Pendiente'}</h2>
        </div>
        
        <p style="margin-top: 20px;">Hola,</p>
        <p>${isConfirmed 
          ? 'Hemos recibido tu pago correctamente. ¡Te esperamos en la pista!' 
          : 'Tu reserva ha sido registrada, pero aún <strong>no está confirmada</strong>. Para asegurar tu pista, por favor completa el pago.'}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
          <p><strong>Deporte:</strong> ${reservation.sport}</p>
          <p><strong>Día:</strong> ${reservation.date}</p>
          <p><strong>Pista:</strong> ${reservation.courtName || 'Seleccionada'}</p>
          <p><strong>Hora:</strong> ${reservation.hour}:00h</p>
        </div>

        ${isConfirmed ? `
          <div style="text-align: center; margin-top: 25px; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="font-size: 14px; color: #555;">Añadir a mi calendario:</p>
            
            <a href="${getGoogleCalendarUrl(reservation)}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none;
             border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">
              Google Calendar
            </a>

            <p style="font-size: 11px; color: #999; margin-top: 10px;">
              * Los usuarios de iPhone/Mac verán un archivo adjunto para añadirlo directamente.
            </p>
          </div>
        ` : ''}

        ${(!isConfirmed && paymentUrl) ? `
          <div style="text-align: center; margin-top: 25px;">
            <a href="${paymentUrl}" style="background-color: #3498db; color: white; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;
             display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              💳 PAGAR AHORA
            </a>
            <p style="font-size: 11px; color: #999; margin-top: 10px;">
              Si el botón no funciona, copia este enlace en tu navegador:<br>
              ${paymentUrl}
            </p>
          </div>
        ` : ''}

        <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
          Club Deportivo - Gestión de Reservas
        </p>
      </div>
    `
  };

  // --- CONFIGURACIÓN PARA EL BANNER AUTOMÁTICO EN APPLE ---
  // Esto soluciona el error de TypeScript al añadir 'alternatives' dinámicamente
  if (isConfirmed && icsContent) {
    mailOptions.alternatives = [{
      contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      content: icsContent
    }];
  }

  // Enviamos el email una sola vez al final
  return transporter.sendMail(mailOptions);
};
