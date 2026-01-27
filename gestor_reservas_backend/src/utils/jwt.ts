//Utils para JWT (genera Tokens, los valida y esta centraizado)
import jwt from 'jsonwebtoken';

// Definimos una clave por defecto por si el .env falla (solo para desarrollo)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_provisional';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    // Fuerzo el tipo para que coincida con lo que espera la librería
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};