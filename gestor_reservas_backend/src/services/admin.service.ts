//Servicio ADMIN logica

import {
  getAllReservations,
  adminCancelReservation
} from '../repositories/admin.repository';

/**
 * Servicio para obtener la totalidad de las reservas del sistema.
 * Útil para alimentar la tabla principal del panel de administración.
 */
export const listAllReservations = async (
  startDate?: string, 
  endDate?: string, 
  status?: string, 
  courtId?: number
) => {
  // ****** Actualizacion, se pasan los 4 parámetros al repositorio para que la consulta SQL sea precisa
  return await getAllReservations(startDate, endDate, status, courtId);
};

/**
 * Servicio para que el administrador anule una reserva.
 * A diferencia del servicio de usuario, aquí no se requiere el 'userId'
 * para validar la propiedad, permitiendo una gestión total.
 */
export const cancelReservationAsAdmin = async (
  reservationId: number
) => {
  // Ejecuta la actualización del estado a 'cancelled' en la base de datos
  return await adminCancelReservation(reservationId);
};



/*FUTURO*/
/*
* en el panel de admin podrías añadir filtros en esta capa, por ejemplo:
----- Filtro por estado: Para ver solo las confirmed o solo las cancelled.
----- Filtro por fecha: Para ver qué reservas hay para la semana que viene.
*/
