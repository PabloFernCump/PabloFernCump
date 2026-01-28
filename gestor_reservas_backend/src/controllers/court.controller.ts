//Controlador de pistas

import { Request, Response } from 'express';
import {
  listCourts,
  createNewCourt,
  updateExistingCourt
} from '../services/court.service';

/**
 * Controlador para obtener la lista de todas las pistas.
 * @route GET /api/courts
 */
export const getCourts = async (_req: Request, res: Response) => {
  try {
    // Llama al servicio para obtener los datos de la BBDD
    const courts = await listCourts();
    // Responde con un status 200 (por defecto) y el array de pistas
    res.json(courts);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las pistas' });
  }
};

/**
 * Controlador para crear una nueva pista.
 * @route POST /api/courts
 * @access Admin (ID 2)
 */
export const createCourt = async (req: Request, res: Response) => {
  try {
    // Pasa el cuerpo de la petición (body) al servicio para su validación e inserción
    const result = await createNewCourt(req.body);
    // Retorna status 201 (Created) y el resultado de la operación
    res.status(201).json(result);
  } catch (error: any) {
    // Si el servicio lanza un error (ej. faltan campos), capturamos el mensaje
    res.status(400).json({ message: error.message });
  }
};

/**
 * Controlador para actualizar los datos de una pista existente.
 * @route PUT /api/courts/:id
 * @access Admin (ID 2)
 */
export const updateCourt = async (req: Request, res: Response) => {
  try {
    // Extraemos el ID de los parámetros de la URL y lo convertimos a número
    const id = Number(req.params.id);
    // Enviamos el ID y los nuevos datos al servicio
    const result = await updateExistingCourt(id, req.body);
    res.json(result);
  } catch (error: any) {
    // Captura errores como "Pista no encontrada" definidos en el servicio
    res.status(400).json({ message: error.message });
  }
};