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
  email: string,
  passwordHash: string
) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result;
};
