//Rutas ADMIN

import { Router } from 'express';
import { 
  getAllReservations, 
  cancelReservation, 
  getAllUsers, // <--- 1. Importamos la nueva función
  getUserById,      // <--- IMPORTADO: Obtener un socio por ID
  updateUserInfo,   // <--- IMPORTADO: Actualizar datos del socio
  deleteUserInfo    // <--- IMPORTADO: Eliminar socio
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

/**
 * RUTA: Obtener todos los usuarios
 * Acceso: Solo Administradores
 */
router.get('/users', authMiddleware, adminOnly, getAllUsers); // <--- 2. Creamos la ruta

/**
 * RUTA: Obtener un usuario específico por ID
 * Acceso: Solo Administradores
 */
router.get('/users/:id', authMiddleware, adminOnly, getUserById);

/**
 * RUTA: Actualizar información de un usuario
 * Acceso: Solo Administradores
 */
router.put('/users/:id', authMiddleware, adminOnly, updateUserInfo);

/**
 * RUTA: Eliminar un usuario permanentemente
 * Acceso: Solo Administradores
 */
router.delete('/users/:id', authMiddleware, adminOnly, deleteUserInfo);

export default router;