//Controller de reservas (HTTP)

import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  createNewReservation,
  listUserReservations,
  cancelUserReservation
} from '../services/reservation.service';

/**
 * Gestiona la creación de una nueva reserva.
 * Extrae el ID del usuario del token JWT para asegurar la identidad.
 */
export const createReservation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // req.user.id viene inyectado desde el middleware de autenticación
    const userId = req.user.id; 
    const result = await createNewReservation(userId, req.body);
    
    // Status 201: Recurso creado con éxito
    res.status(201).json(result);
  } catch (error: any) {
    // Si falla alguna validación del servicio (fecha, solapamiento), enviamos el error
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtiene todas las reservas del usuario que hace la petición.
 */
export const getMyReservations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const reservations = await listUserReservations(userId);
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
};

/**
 * Cancela una reserva específica verificando que pertenezca al usuario.
 * El ID de la reserva se obtiene de la URL (/api/reservations/:id).
 */
export const cancelReservation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const reservationId = Number(req.params.id);
    
    const result = await cancelUserReservation(reservationId, userId);

    // Si no se afectó ninguna fila, es que no se encontró la reserva (o no es del usuario)
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'No se encontró la reserva o no tienes permiso para cancelarla' 
      });
    }

    res.json({ message: 'Reserva cancelada correctamente' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};