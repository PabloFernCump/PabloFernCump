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

// --- NUEVAS FUNCIONES PARA EL PANEL DE ESTADÍSTICAS ---

/**
 * Obtiene el total de reservas realizadas en los últimos 7 días agrupadas por día de la semana.
 * Útil para el gráfico de barras de actividad semanal.
 */
export const getWeeklyStats = async () => {
  const [rows] = await db.query(`
    SELECT 
      CASE DAYOFWEEK(date)
        WHEN 2 THEN 'Lun'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Mie'
        WHEN 5 THEN 'Jue'
        WHEN 6 THEN 'Vie'
        WHEN 7 THEN 'Sab'
        WHEN 1 THEN 'Dom'
      END as name,
      COUNT(*) as total
    FROM reservations
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DAYOFWEEK(date), name
    ORDER BY DAYOFWEEK(date)
  `);
  return rows;
};

/**
 * Obtiene la distribución de reservas según el tipo de deporte (Pádel, Tenis, etc.)
 * Basado en la columna 'type' de la tabla 'courts'.
 */
export const getReservationsBySport = async () => {
  const [rows] = await db.query(`
    SELECT c.type as name, COUNT(r.id) as value
    FROM courts c
    LEFT JOIN reservations r ON c.id = r.court_id
    GROUP BY c.type
  `);
  return rows;
};

/**
 * Obtiene indicadores clave (KPIs) globales del sistema.
 * Devuelve el total histórico de usuarios, reservas y pistas activas.
 */
export const getGlobalCounts = async () => {
  const [users] = await db.query('SELECT COUNT(*) as total FROM users');
  const [reservations] = await db.query('SELECT COUNT(*) as total FROM reservations');
  const [courts] = await db.query('SELECT COUNT(*) as total FROM courts');
  
  return {
    totalUsuarios: (users as any)[0].total,
    totalReservas: (reservations as any)[0].total,
    totalPistas: (courts as any)[0].total
  };
};

/**
 * Obtiene la previsión de reservas para los próximos 7 días (incluyendo hoy).
 * Útil para que el administrador planifique el personal o mantenimiento.
 */
export const getUpcomingStats = async () => {
  const [rows] = await db.query(`
    SELECT 
      CASE DAYOFWEEK(date)
        WHEN 2 THEN 'Lun'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Mie'
        WHEN 5 THEN 'Jue'
        WHEN 6 THEN 'Vie'
        WHEN 7 THEN 'Sab'
        WHEN 1 THEN 'Dom'
      END as name,
      COUNT(*) as total
    FROM reservations
    WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DAYOFWEEK(date), name
    ORDER BY date ASC
  `);
  return rows;
};