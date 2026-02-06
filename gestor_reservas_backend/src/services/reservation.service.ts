//Servicio de reservas (logica real)

import {
  getReservationsByCourtAndDate,
  getReservationsBySportAndDate, // <--- NUEVO: Añadido para disponibilidad por deporte
  createReservation,
  getUserReservations,
  cancelReservation
} from '../repositories/reservation.repository';
// Cambiamos getCourts por getAllCourts y lo renombramos para que coincida con la lógica de abajo
import { getCourtById, getAllCourts as getCourts } from '../repositories/court.repository'; 

/**
 * NUEVO: Lógica para obtener disponibilidad por Deporte y Fecha.
 * Útil para el flujo de reserva: Deporte -> Fecha -> Horas Disponibles.
 */
export const getAvailableSlots = async (sport: string, date: string) => {
  // 1. Obtener todas las pistas de ese deporte que estén activas
  // Usamos "as any[]" para que TS permita usar .filter()
  const allCourts = await getCourts() as any[];
  const sportCourts = allCourts.filter((c: any) => c.type === sport && c.active === 1);

  if (sportCourts.length === 0) return [];

  // 2. Obtener las reservas ya existentes para ese deporte y día
  // Forzamos el tipo a "any[]" para evitar el error de QueryResult / OkPacket
  const existingReservations = await getReservationsBySportAndDate(sport, date) as any[];

  // 3. Definir las franjas horarias del club (puedes ajustar estos horarios luego)
  const slots = ["09:00", "10:30", "12:00", "13:30", "16:00", "17:30", "19:00", "20:30"];
  
  // 4. Para cada franja, ver si hay alguna pista libre
  const availability = slots.map(startTime => {
    // Calculamos fin de reserva (asumiendo 1.5h por defecto para el cálculo de solapamiento)
    const [hours, minutes] = startTime.split(':').map(Number);
    const end = new Date();
    end.setHours(hours + 1, minutes + 30);
    const endTime = end.toTimeString().substring(0, 5);

    // Identificamos qué pistas están ocupadas en este slot exacto
    // Tipamos 'r' como 'any' para evitar el error de parámetro implícito
    const occupiedCourtIds = existingReservations
      .filter((r: any) => (startTime < r.end_time && endTime > r.start_time))
      .map((r: any) => r.court_id);

    // Buscamos pistas de este deporte que NO estén en la lista de ocupadas
    // Tipamos 'c' como 'any' para resolver el error de la imagen 30a2f9
    const freeCourts = sportCourts.filter((c: any) => !occupiedCourtIds.includes(c.id));

    return {
      time: startTime,
      endTime: endTime,
      available: freeCourts.length > 0,
      courts: freeCourts 
    };
  });

  return availability;
};

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