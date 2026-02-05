//Controlador de pistas

import { Request, Response } from 'express';
// IMPORTANTE: Cambiamos listCourts por getCourts
import {
  getCourts as getCourtsService, // Lo renombramos aquí para que no choque con el nombre de la función del controlador
  getCourtDetails, // <--- NUEVO IMPORT: Para obtener una sola pista
  createNewCourt,
  updateExistingCourt
} from '../services/court.service';

/**
 * Controlador para obtener la lista de todas las pistas.
 * @route GET /api/courts
 */
export const getCourts = async (_req: Request, res: Response) => {
  try {
    // Llamamos a la función del servicio (que ahora se llama getCourts)
    const courts = await getCourtsService();
    res.json(courts);
  } catch (error: any) {
    // Si ves este error en la consola, es que algo falló dentro del servicio
    console.error("Error en getCourts Controller:", error); 
    res.status(500).json({ message: 'Error al obtener las pistas' });
  }
};

/**
 * NUEVO CONTROLADOR: Obtener una sola pista por ID
 * @route GET /api/courts/:id
 * Útil para cargar los datos en el formulario de edición.
 */
export const getCourtById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const court = await getCourtDetails(id);
    res.json(court);
  } catch (error: any) {
    console.error("Error en getCourtById Controller:", error);
    res.status(404).json({ message: error.message });
  }
};

/**
 * Controlador para crear una nueva pista.
 * @route POST /api/courts
 */
export const createCourt = async (req: Request, res: Response) => {
  try {
    const result = await createNewCourt(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Controlador para actualizar los datos de una pista existente.
 * @route PUT /api/courts/:id
 */
export const updateCourt = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await updateExistingCourt(id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};