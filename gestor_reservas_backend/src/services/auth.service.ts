//Servicio de autenticacion

import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';

export const registerUser = async (
  name: string,
  apellidos: string, // <--- Añadimos apellidos
  email: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // Pasamos los 4 parámetros al repositorio
  await createUser(name, apellidos, email, passwordHash);

  return { message: 'Usuario registrado correctamente' };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken({
    id: user.id,
    role_id: user.role_id
  });

  return { 
    token,
    role_id: user.role_id 
};
};