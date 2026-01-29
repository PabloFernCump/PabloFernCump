//Servicio de disponibilidad

import { getCourtById } from '../repositories/court.repository';
import { getReservationsByCourtAndDate } from '../repositories/reservation.repository';

// Definimos la duración de cada bloque de tiempo (30 minutos en este caso)
const SLOT_MINUTES = 30;

/**
 * Función auxiliar para sumar minutos a una cadena de tiempo (HH:mm).
 * Retorna la nueva hora en formato HH:mm.
 */
const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0);
  return date.toTimeString().slice(0, 5); // Ejemplo: "10:30"
};

/**
 * Calcula los huecos libres disponibles para una pista en una fecha concreta.
 */
export const getAvailability = async (
  courtId: number,
  date: string
) => {
  // 1. Verificamos que la pista existe y está operativa
  const court = await getCourtById(courtId);

  if (!court || court.active === 0) {
    throw new Error('Pista no disponible');
  }

  // 2. Obtenemos todas las reservas ya confirmadas para ese día
  const reservations = await getReservationsByCourtAndDate(
    courtId,
    date
  ) as any[];

  const slots: string[] = [];

  // 3. Empezamos el recorrido desde la hora de apertura de la pista
  let currentTime = court.opening_time;
  
  while (currentTime < court.closing_time) {
    const nextTime = addMinutes(currentTime, SLOT_MINUTES);

    // 4. Comprobamos si este bloque de 30 min se solapa con alguna reserva existente
    const isOccupied = reservations.some(r =>
      currentTime < r.end_time && 
      nextTime > r.start_time
    );

    // 5. Si el hueco está libre y no excede la hora de cierre, lo guardamos
    if (!isOccupied && nextTime <= court.closing_time) {
      slots.push(`${currentTime}-${nextTime}`);
    }

    // Avanzamos el reloj al siguiente intervalo
    currentTime = nextTime;
  }

  return slots;
};