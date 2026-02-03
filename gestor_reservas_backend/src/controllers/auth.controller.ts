//Controller (HTTP)

import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Extraemos también 'apellidos' del cuerpo de la petición
    const { name, apellidos, email, password } = req.body;
    
    // 2. Se lo pasamos a la función del servicio
    const result = await registerUser(name, apellidos, email, password);
    
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    // Esto enviará tanto el token como el role_id al frontend
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};