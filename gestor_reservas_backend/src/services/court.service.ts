//Servicio de pistas (logica)

import {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt
} from '../repositories/court.repository';

/**
 * 1. DEFINICIÓN DE LA INTERFAZ
 * Esto elimina el error de "la propiedad active no existe" en el frontend.
 */
export interface Court {
  id: number;
  name: string;
  type: string;
  surface: string;
  opening_time: string;
  closing_time: string;
  active: number; // <--- Crucial para que funcione el filtro de disponibilidad
  created_at?: string;
}

/**
 * Servicio para obtener el listado completo de pistas.
 * @returns Promesa con el array de pistas.
 */
export const getCourts = async (): Promise<Court[]> => {
  // Tipamos el retorno como una promesa de array de Court
  return await getAllCourts() as Court[];
};

/**
 * Lógica para obtener los detalles de una pista por su ID.
 * Útil para cargar el formulario de edición.
 */
export const getCourtDetails = async (id: number): Promise<Court> => {
  const court = await getCourtById(id);

  if (!court) {
    throw new Error('Pista no encontrada');
  }

  return court as Court;
};

/**
 * Lógica para registrar una nueva pista.
 * @param data Datos provenientes del controlador.
 */
export const createNewCourt = async (data: any) => {
  const { name, type, surface, opening_time, closing_time, active } = data;

  // Validación de negocio: No permitimos crear pistas sin datos esenciales.
  if (!name || !type) {
    throw new Error('Nombre y tipo son obligatorios');
  }

  return await createCourt(
    name,
    type,
    surface,
    opening_time,
    closing_time,
    active
  );
};

/**
 * Lógica para actualizar una pista existente previa comprobación.
 * @param id ID de la pista.
 * @param data Nuevos datos de la pista.
 */
export const updateExistingCourt = async (id: number, data: any) => {
  // Verificamos primero si la pista existe en la BBDD.
  const court = await getCourtById(id);

  if (!court) {
    throw new Error('Pista no encontrada');
  }

  // Desestructuramos los datos con valores actuales por si alguno viene vacío.
  const {
    name = court.name,
    type = court.type,
    surface = court.surface,
    opening_time = court.opening_time,
    closing_time = court.closing_time,
    active = court.active
  } = data;

  return await updateCourt(
    id,
    name,
    type,
    surface,
    opening_time,
    closing_time,
    active
  );
};