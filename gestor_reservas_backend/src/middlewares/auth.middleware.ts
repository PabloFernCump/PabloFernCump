//Middleware de autenticacion (Protege rutas, añado req.user ->se usara luego en reservas, pagos, admin, etc)

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interfaz AuthRequest: Extendemos la Request de Express para que TypeScript
 * reconozca la propiedad 'user', donde guardaremos los datos del token.
 */
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware de Autenticación:
 * Verifica que el usuario envíe un token válido en los Headers.
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // 1. Verificamos que exista el header Authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  // 2. Extraemos el token del formato "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificamos el token con nuestra clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // 4. Inyectamos los datos decodificados (id, role_id) en la petición
    req.user = decoded;
    
    // 5. Cedemos el paso al siguiente middleware o controlador
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
