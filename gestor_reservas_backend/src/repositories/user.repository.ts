//Repositorio de usuarios (BBDD)

import { db } from '../config/database';

export const findUserByEmail = async (email: string) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return (rows as any[])[0];
};

export const createUser = async (
  name: string,
  apellidos: string, // <--- Añadimos el nuevo parámetro
  email: string,
  passwordHash: string
) => {
  const [result] = await db.query(
    'INSERT INTO users (name, apellidos, email, password_hash) VALUES (?, ?, ?, ?)', // <--- Añadimos apellidos y un "?" extra
    [name, apellidos, email, passwordHash] // <--- Pasamos el valor a la consulta
  );
  return result;
};