//Rutas ADMIN

import { Router } from 'express';
import { 
  getAllReservations, 
  cancelReservation 
} from '../controllers/admin.controller';

// Importamos cada middleware de su archivo correspondiente
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

/**
 * RUTA: Obtener todas las reservas del sistema
 * Acceso: Solo Administradores
 * Middleware: authMiddleware (valida token) + adminMiddleware (valida role_id)
 */
router.get('/reservations', authMiddleware, adminOnly, getAllReservations);

/**
 * RUTA: Cancelar cualquier reserva por ID
 * Acceso: Solo Administradores
 * Método: PUT para actualizar el estado a 'cancelled' en la BBDD
 */
router.put('/reservations/:id/cancel', authMiddleware, adminOnly, cancelReservation);

export default router;