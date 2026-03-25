// Controller ADMIN

import { Request, Response } from 'express';
import {
  listAllReservations,
  cancelReservationAsAdmin
} from '../services/admin.service';
import * as userRepository from '../repositories/user.repository'; // Importamos el repositorio
import * as adminRepository from '../repositories/admin.repository'; // Importo el repositorio para traer las estadisticas

/**
 * Obtiene el listado global de reservas para el panel de administración.
 * No requiere filtrar por usuario ya que el admin ve todo el sistema.
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
 */
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const reservationId = Number(req.params.id);
    const result: any = await cancelReservationAsAdmin(reservationId);

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

/**
 * Obtiene los datos de un único usuario por su ID.
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

/**
 * Obtiene todos los datos iniciales para el panel de estadísticas.
 * Actualizado para incluir la carga inicial de afluencia horaria.
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Añadimos getHourlyStats() al Promise.all para la carga inicial por defecto
    const [dailyData, sportData, globalKPIs, upcomingData, hourlyData] = await Promise.all([
      adminRepository.getWeeklyStats(),      
      adminRepository.getReservationsBySport(), 
      adminRepository.getGlobalCounts(),
      adminRepository.getUpcomingStats(),
      adminRepository.getHourlyStats() // <--- Nueva consulta inicial
    ]);

    res.json({
      dailyData,
      sportData,
      globalKPIs,
      upcomingData,
      hourlyData
    });
  } catch (error: any) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: 'Error al generar el informe' });
  }
};

/**
 * NUEVO: Obtiene los datos de afluencia filtrados por día de la semana y mes.
 * Este controlador responde específicamente a los cambios de los selectores en el frontend.
 */
export const getHourlyStatsFiltered = async (req: Request, res: Response) => {
  try {
    const { day, month } = req.query;
    
    // Llamamos al repositorio pasando los filtros convertidos a número
    const data = await adminRepository.getHourlyStats(
      day ? Number(day) : undefined,
      month ? Number(month) : undefined
    );
    
    res.json(data);
  } catch (error: any) {
    console.error("Error al filtrar estadísticas horarias:", error);
    res.status(500).json({ message: 'Error al filtrar el informe horario' });
  }
};