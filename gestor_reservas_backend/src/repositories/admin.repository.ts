//Repositorio admin de reservas

import { db } from '../config/database';

/**
 * Obtiene el listado completo de todas las reservas del sistema.
 * Realiza un JOIN con 'users' y 'courts' para mostrar información legible al administrador.
 * ***** Añado un filtro para que en la consulta de las reservas, puedas elegir el inicio fecha, fin fecha, el estado y la pista
 */
export const getAllReservations = async (
  startDate?: string, 
  endDate?: string, 
  status?: string, 
  courtId?: number) => {
  let query = `
    SELECT 
      r.id, r.date, r.start_time, r.end_time, r.status,
      u.name AS user_name,
      c.name AS court_name
    FROM reservations r
    JOIN users u ON u.id = r.user_id
    JOIN courts c ON c.id = r.court_id
    WHERE 1=1`;

  const params: any[] = [];

  // Filtro de rango de fechas
  if (startDate && endDate) {
    query += ` AND r.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  } else if (startDate) {
    query += ` AND r.date >= ?`;
    params.push(startDate);
  }

  if (status) {
    query += ` AND r.status = ?`;
    params.push(status);
  }

  if (courtId) {
    query += ` AND r.court_id = ?`;
    params.push(courtId);
  }

  query += ` ORDER BY r.date ASC, r.start_time ASC`;

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Permite al administrador cancelar cualquier reserva por su ID.
 * A diferencia del repositorio de usuario, aquí no filtramos por 'user_id'
 * porque el administrador tiene poder global sobre todas las filas.
 */
export const adminCancelReservation = async (reservationId: number) => {
  const [result] = await db.query(
    `UPDATE reservations 
     SET status = 'cancelled'
     WHERE id = ?`,
    [reservationId]
  );


  return result;
};