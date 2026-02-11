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

export const findAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, name as nombre, apellidos, email, role_id FROM users'
  );
  return rows as any[];
};

// --- NUEVAS FUNCIONES PARA GESTIÓN DE USUARIOS (ADMIN) ---

/**
 * Busca un usuario específico por su ID único.
 * Se usa para cargar los datos en el formulario de edición.
 */
export const findUserById = async (id: number) => {
  const [rows] = await db.query(
    'SELECT id, name as nombre, apellidos, email, role_id FROM users WHERE id = ?',
    [id]
  );
  return (rows as any[])[0];
};

/**
 * Actualiza los datos de un usuario existente.
 * Recibe el ID y un objeto con los nuevos datos (nombre, apellidos, email, rol).
 */
export const updateUser = async (id: number, userData: any) => {
  const [result] = await db.query(
    'UPDATE users SET name = ?, apellidos = ?, email = ?, role_id = ? WHERE id = ?',
    [userData.nombre, userData.apellidos, userData.email, userData.role_id, id]
  );
  return result;
};

/**
 * Elimina un usuario de la base de datos de forma permanente.
 */
export const deleteUser = async (id: number) => {
  const [result] = await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result;
};