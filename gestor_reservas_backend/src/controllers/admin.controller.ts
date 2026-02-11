//Controller ADMIN

import { Request, Response } from 'express';
import {
  listAllReservations,
  cancelReservationAsAdmin
} from '../services/admin.service';
import * as userRepository from '../repositories/user.repository'; // Importamos el repositorio

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

/**
 * Obtiene el listado de todos los usuarios registrados
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener el listado de usuarios' });
  }
};

// --- NUEVOS CONTROLADORES PARA LA GESTIÓN INDIVIDUAL DE USUARIOS ---

/**
 * Obtiene los datos de un único usuario por su ID.
 * Se utiliza para rellenar el formulario de edición en el frontend.
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userRepository.findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los detalles del usuario' });
  }
};

/**
 * Actualiza la información de un usuario (Nombre, Apellidos, Email, Rol).
 * Recibe los datos desde el cuerpo de la petición (req.body).
 */
export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result: any = await userRepository.updateUser(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se pudo actualizar: usuario no encontrado' });
    }

    res.json({ message: 'Información del socio actualizada correctamente' });
  } catch (error: any) {
    res.status(400).json({ message: 'Error al procesar la actualización del usuario' });
  }
};

/**
 * Elimina permanentemente un usuario del sistema.
 */
export const deleteUserInfo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result: any = await userRepository.deleteUser(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar: usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado del sistema con éxito' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al intentar eliminar el usuario' });
  }
};