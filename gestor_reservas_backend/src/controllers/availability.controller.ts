//Controller de disponibilidad

import { Request, Response } from 'express';
import { getAvailability } from '../services/availability.service';

/**
 * Controlador para consultar los huecos libres de una pista específica.
 * Endpoint esperado: GET /api/availability/:id?date=YYYY-MM-DD
 */
export const getCourtAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    // Extraemos el ID de la pista de los parámetros de la URL
    const courtId = Number(req.params.id);
    
    // La fecha se recibe como Query Parameter (ej: ?date=2026-02-10)
    const { date } = req.query;

    // 1. Validamos que el usuario haya enviado la fecha, ya que es indispensable
    if (!date) {
      return res.status(400).json({ message: 'Fecha requerida' });
    }

    // 2. Llamamos al servicio para calcular los slots de 30 minutos
    const slots = await getAvailability(
      courtId,
      date as string
    );

    // 3. Respondemos con el array de strings (ej: ["09:00-09:30", "10:00-10:30"])
    res.json(slots);
  } catch (error: any) {
    // Si la pista no existe o está inactiva, capturamos el error del servicio
    res.status(400).json({ message: error.message });
  }
};