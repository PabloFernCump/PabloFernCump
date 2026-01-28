//Rutas de pistas

import { Router } from 'express';
import { getCourts, createCourt, updateCourt } from '../controllers/court.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();

/**
 * RUTA: Obtener todas las pistas
 * @access Público (Cualquier usuario puede ver las pistas disponibles)
 */
router.get('/', getCourts);

/**
 * RUTA: Crear una nueva pista
 * @access Privado (Requiere Token válido Y Rol de Admin [ID 2])
 */
router.post(
  '/',
  authMiddleware, // Primero verificamos que el usuario esté logueado
  adminOnly,      // Segundo verificamos que sea Administrador (ID 2)
  createCourt     // Finalmente ejecutamos la creación
);

/**
 * RUTA: Actualizar una pista existente
 * @access Privado (Requiere Token válido Y Rol de Admin [ID 2])
 */
router.put(
  '/:id',
  authMiddleware, // Middleware de autenticación
  adminOnly,      // Middleware de autorización por rol
  updateCourt     // Ejecutamos la actualización
);

export default router;