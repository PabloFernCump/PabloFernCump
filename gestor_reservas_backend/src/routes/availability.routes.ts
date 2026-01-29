//Rutas de disponibilidad

import { Router } from 'express';
import { getCourtAvailability } from '../controllers/availability.controller';

const router = Router();

/**
 * Ruta para consultar la disponibilidad de una pista.
 * Método: GET
 * URL: /api/availability/courts/:id/availability?date=YYYY-MM-DD
 * * Nota: Esta ruta suele ser pública para que cualquier usuario vea 
 * los huecos libres antes de decidir registrarse o loguearse.
 */
router.get('/courts/:id/availability', getCourtAvailability);

export default router;