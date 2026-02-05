//Repositorio de pistas (BBDD)

import { db } from '../config/database';

/**
Obtiene todas las pistas registradas en la base de datos.
@returns Lista de todas las pistas.
*/
export const getAllCourts = async () => {
  // Ejecuta la consulta para traer todos los registros de la tabla 'courts'
  const [rows] = await db.query('SELECT * FROM courts');
  return rows;
};

/**
 * Busca una pista específica por su ID.
 * @param id Identificador único de la pista.
 * @returns El objeto de la pista encontrada o null si no existe.
 */
export const getCourtById = async (id: number) => {
  const [rows] = await db.query(
    'SELECT * FROM courts WHERE id = ?',
    [id]
  );
  
  // MEJORA: Validamos si existe el registro antes de intentar acceder a él.
  // Si no hay resultados, devuelve null en lugar de dar un error de "undefined".
  const courts = rows as any[];
  return courts.length > 0 ? courts[0] : null;
};

/**
 * Inserta una nueva pista en la base de datos.
 * @param name Nombre de la pista (ej. Pista 1).
 * @param type Deporte (ej. Pádel o Tenis).
 * @param surface Tipo de suelo (ej. Césped, Tierra Batida).
 * @param opening_time Hora de apertura.
 * @param closing_time Hora de cierre.
 * @returns Resultado de la inserción.
 */
export const createCourt = async (   /*-> Función createCourt mejorada*/
  name: string,
  type: string,
  surface: string,
  opening_time: string,
  closing_time: string,
  active: number // <--- se añade el estado de la pista
) => {
  // Usamos una consulta preparada con "?" para evitar Inyección SQL
  const [result] = await db.query(
    `INSERT INTO courts 
     (name, type, surface, opening_time, closing_time, active)
     VALUES (?, ?, ?, ?, ?, 1)`, // <--- Añadimos el 1 por defecto al crearla
    [name, type, surface, opening_time, closing_time, active]
  );
  return result;
};

/**
 * Actualiza la información de una pista existente.
 * @param id ID de la pista a editar.
 * @param active Estado de la pista (1 activa, 0 inactiva/mantenimiento).
 */
export const updateCourt = async (
  id: number,
  name: string,
  type: string,
  surface: string,
  opening_time: string,
  closing_time: string,
  active: number
) => {
  const [result] = await db.query(
    `UPDATE courts SET
      name = ?, type = ?, surface = ?, 
      opening_time = ?, closing_time = ?, active = ?
     WHERE id = ?`,
    [name, type, surface, opening_time, closing_time, active, id]
  );
  return result;
};
