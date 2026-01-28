//Middleware de Rol (ADMIN)

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware para restringir el acceso únicamente a administradores.
 * Basado en tu base de datos: ID 2 = admin, ID 1 = user.
 */
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Verificamos si el usuario autenticado tiene el role_id de administrador (2)
  // [Referencia: image_6e6ff1.png en phpMyAdmin]
  if (req.user?.role_id !== 2) {
    return res.status(403).json({ 
      message: 'Acceso denegado: Se requieren permisos de administrador' 
    });
  }

  // Si el rol es 2, permitimos el acceso a la ruta de gestión de pistas
  next();
};