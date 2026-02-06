//Rutas de reserva

import { Router } from 'express';
import {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAvailability // <--- Añadido el nuevo controlador
} from '../controllers/reservation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

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
 * Ruta para que un usuario consulte sus propias reservas.
 * Se usa '/mine' para diferenciarlo de una posible ruta administrativa.
 */
router.get('/mine', authMiddleware, getMyReservations);

/**
 * Ruta para cancelar una reserva.
 * Se usa el método PUT porque estamos actualizando el estado de la reserva a 'cancelled'.
 */
router.put('/:id/cancel', authMiddleware, cancelReservation);

export default router;