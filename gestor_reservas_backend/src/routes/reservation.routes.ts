//Rutas de reserva

import { Router } from 'express';
import {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAvailability // <--- Añadido el nuevo controlador
} from '../controllers/reservation.controller';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
/*import { sendReservationEmail } from '../services/email.service';*/


const router = Router();

/**
 * NUEVA RUTA: Consultar disponibilidad de pistas.
 * Permite al usuario ver qué horas están libres antes de reservar.
 */
router.get('/availability', authMiddleware, getAvailability);

/**
 * Ruta para crear una reserva.
 * Requiere token. El ID del usuario se extrae del JWT en el controlador.
 */
router.post('/', authMiddleware, createReservation);

/**
 * RUTA ACTUALIZADA PARA COINCIDIR CON EL FRONTEND
 * Antes era '/mine', ahora es '/my-reservations' para que el fetch del frontend funcione.
 */
router.get('/my-reservations', authMiddleware, getMyReservations);

/**
 * Ruta para cancelar una reserva.
 * Se usa el método PUT porque estamos actualizando el estado de la reserva a 'cancelled'.
 */
router.put('/:id/cancel', authMiddleware, cancelReservation);


/*
// Ruta temporal de prueba
router.get('/test-email', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const dummyReservation = {
      sport: 'Pádel',
      date: '2026-03-20',
      courtName: 'Pista Central',
      hour: '18'
    };

    // Usamos el email que extrae el middleware del Token
    await sendReservationEmail(req.user.email, dummyReservation, 'PENDING');
    
    res.json({ message: `Prueba enviada a ${req.user.email}. Revisa tu bandeja de entrada.` });
  } catch (error: any) {
    console.error("Error en test-email:", error);
    res.status(500).json({ error: error.message });
  }
});
*/

export default router;