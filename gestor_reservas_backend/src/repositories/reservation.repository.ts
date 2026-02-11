//Repositorio de reservas (BBDD)

import { db } from '../config/database';

/**
 * Busca reservas confirmadas para una pista y fecha específicas.
 * Útil para validar que no haya solapamientos antes de crear una nueva reserva.
 */
export const getReservationsByCourtAndDate = async (
  courtId: number,
  date: string
) => {
  const [rows] = await db.query(
    `SELECT * FROM reservations 
     WHERE court_id = ? AND date = ? AND status = 'confirmed'`,
    [courtId, date]
  );
  return rows;
};

/**
 * NUEVO: Obtiene todas las reservas confirmadas para un tipo de deporte y fecha.
 * Cruza la tabla de reservas con la de pistas para filtrar por deporte (Pádel/Tenis).
 */
export const getReservationsBySportAndDate = async (type: string, date: string) => {
  const [rows] = await db.query(
    `SELECT r.*, c.type 
     FROM reservations r
     JOIN courts c ON r.court_id = c.id
     WHERE LOWER(c.type) = LOWER(?) AND r.date = ? AND r.status = 'confirmed'`,
    [type, date]
  );
  return rows;
};

/**
 * Inserta una nueva reserva en la base de datos.
 * Por defecto, el estado (status) suele ser 'confirmed' según la estructura de la tabla.
 */
export const createReservation = async (
  userId: number,
  courtId: number,
  date: string,
  startTime: string,
  endTime: string
) => {
  const [result] = await db.query(
    `INSERT INTO reservations 
     (user_id, court_id, date, start_time, end_time)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, courtId, date, startTime, endTime]
  );
  return result;
};

/**
 * Obtiene el historial de reservas de un usuario.
 * Incluye un JOIN con la tabla 'courts' para mostrar el nombre de la pista.
 */
export const getUserReservations = async (userId: number) => {
  const [rows] = await db.query(
    `SELECT 
        r.id, 
        r.date, 
        r.start_time, 
        r.end_time, 
        r.status,
        c.name AS court_name,
        c.type AS court_type
     FROM reservations r
     JOIN courts c ON r.court_id = c.id
     WHERE r.user_id = ?
     ORDER BY r.date DESC, r.start_time DESC`,
    [userId]
  );
  return rows;
};

/**
 * Cambia el estado de una reserva a 'cancelled'.
 * Se incluye el userId por seguridad, para que un usuario solo pueda cancelar sus propias reservas.
 */
export const cancelReservation = async (
  reservationId: number,
  userId: number
) => {
    const [result]: any = await db.query(
     `UPDATE reservations 
      SET status = 'cancelled'
      WHERE id = ? AND user_id = ?`,
    [reservationId, userId]
  );
  // Devolvemos el resultado para poder leer 'affectedRows' en el controlador
  return result;
};