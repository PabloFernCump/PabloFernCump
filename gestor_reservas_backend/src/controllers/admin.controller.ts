//Controller ADMIN

import { Request, Response } from 'express';
import {
  listAllReservations,
  cancelReservationAsAdmin
} from '../services/admin.service';

/**
 * Obtiene el listado global de reservas para el panel de administración.
 * No requiere filtrar por usuario ya que el admin ve todo el sistema.
 * ****** Añado la actualizacion del controlador de ADMIN, para las consultas de inicio fecha, fin fecha, estado y pista
 */
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status, courtId } = req.query;

    const reservations = await listAllReservations(
      startDate as string,
      endDate as string,
      status as string,
      courtId ? Number(courtId) : undefined
    );
    
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener el rango de reservas' });
  }
};

/**
 * Procesa la cancelación forzosa de una reserva desde el panel de control.
 * Utiliza el ID de la reserva enviado en la URL.
 */
export const cancelReservation = async (
  req: Request,
  res: Response
) => {
  try {
    const reservationId = Number(req.params.id);
    
    // Ejecutamos la cancelación y capturamos el resultado del repositorio
    const result: any = await cancelReservationAsAdmin(reservationId);

    // Verificamos si realmente se encontró y actualizó la fila en la BBDD
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva cancelada por el administrador correctamente' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};