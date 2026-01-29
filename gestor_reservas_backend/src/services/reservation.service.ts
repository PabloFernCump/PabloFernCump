//Servicio de reservas (logica real)

import {
  getReservationsByCourtAndDate,
  createReservation,
  getUserReservations,
  cancelReservation
} from '../repositories/reservation.repository';
import { getCourtById } from '../repositories/court.repository';

/**
 * Lógica para crear una nueva reserva con validaciones de seguridad, fecha y disponibilidad.
 */
export const createNewReservation = async (
  userId: number,
  data: any
) => {
  const { court_id, date, start_time, end_time } = data;

  // 1. Validación de campos obligatorios
  if (!court_id || !date || !start_time || !end_time) {
    throw new Error('Datos incompletos');
  }

  // 2. Validación de fecha: Evita reservas en días que ya han pasado
  const reservationDate = new Date(date);
  const today = new Date(); // new Date () incluye la hora actual
  today.setHours(0, 0, 0, 0); // Ajusto a medianoche para permitir reservas hoy mismo.
  // Al poner las horas a cero today.setHours(0, 0, 0, 0), se permiten reservas para el día de hoy sin problemas.

  if (reservationDate < today) {
    throw new Error('No puedes reservar en una fecha pasada');
  }

  // 3. Verificar que la pista existe y está activa
  const court = await getCourtById(court_id);

  if (!court || court.active === 0) {
    throw new Error('Pista no disponible');
  }

  // 4. Validar que la reserva esté dentro del horario de la pista
  if (
    start_time < court.opening_time ||
    end_time > court.closing_time
  ) {
    throw new Error('Horario fuera del horario de la pista');
  }

  // 5. Comprobar solapamientos con otras reservas confirmadas
  const reservations = await getReservationsByCourtAndDate(
    court_id,
    date
  );

  for (const r of reservations as any[]) {
    // Si la nueva reserva se cruza con alguna existente, lanzamos error
    if (
      start_time < r.end_time &&
      end_time > r.start_time
    ) {
      throw new Error('La pista ya está reservada en ese horario');
    }
  }

  // 6. Si todo es correcto, guardamos en la base de datos
  return await createReservation(
    userId,
    court_id,
    date,
    start_time,
    end_time
  );
};

/**
 * Retorna el listado de reservas del usuario actual
 */
export const listUserReservations = async (userId: number) => {
  return await getUserReservations(userId);
};

/**
 * Procesa la cancelación de una reserva
 */
export const cancelUserReservation = async (
  reservationId: number,
  userId: number
) => {
  return await cancelReservation(reservationId, userId);
};