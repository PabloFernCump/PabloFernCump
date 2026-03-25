//app.ts El corazon del backend

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; //Conecta las rutas de auth a la app
import courtRoutes from './routes/court.routes'; //Conecta las rutas de court a la app
import reservationRoutes from './routes/reservation.routes'; //Conecta las rutas del sistema de reservas a la app
import availabilityRoutes from './routes/availability.routes'; //Conecta las rutas de la disponibilidad de huecos libres a la app
import adminRoutes from './routes/admin.routes'; //Conecta las rutas del panel de administrador a la app

// NUEVO: Importamos el controlador del webhook directamente para la ruta especial
import { stripeWebhook } from './controllers/reservation.controller';

//IMPORT PARA LA RUTA DE PRUEBA MAS ABAJO
//import { db } from './config/database';

// Inicializamos la aplicación Express
const app = express();

/**
 * MIDDLEWARES GLOBALES
 */
// Habilita el Intercambio de Recursos de Origen Cruzado (CORS) para permitir peticiones desde el Frontend
// Esto permite que tu React (puerto 5173) hable con tu API (puerto 3000)
app.use(cors());

/**
 * RUTA ESPECIAL PARA STRIPE WEBHOOK
 * IMPORTANTE: Debe ir ANTES de express.json().
 * Stripe necesita recibir el cuerpo de la petición en formato "raw" (bruto) 
 * para verificar la firma de seguridad y confirmar que el pago es real.
 */
app.post(
  '/api/reservations/webhook', 
  express.raw({ type: 'application/json' }), 
  stripeWebhook
);

// Permite que el servidor entienda y procese archivos en formato JSON
// Se coloca después del Webhook para no interferir con la validación de Stripe
app.use(express.json());


/**
 * DEFINICIÓN DE RUTAS (ENDPOINTS)
 */
// Conecta todas las rutas relacionadas con usuarios y login bajo el prefijo /api/auth
app.use('/api/auth', authRoutes);

// Conecta el CRUD de pistas bajo el prefijo /api/courts
// Importante recordar que algunas de estas rutas están protegidas por roles
app.use('/api/courts', courtRoutes);

// Conecta el sistema de gestión de reservas bajo el prefijo /api/reservations
// Todas estas rutas requieren autenticación mediante JWT para identificar al usuario
app.use('/api/reservations', reservationRoutes);

// Conecta el sistema de consulta de huecos libres
app.use('/api/availability', availabilityRoutes);

/**
 * Rutas de Administración:
 * Define el punto de entrada para la gestión global de reservas.
 * Todas las rutas dentro de 'adminRoutes' requerirán el prefijo /api/admin.
 * Ejemplo: GET /api/admin/reservations
 */
app.use('/api/admin', adminRoutes);

/* RUTA DE PRUEBA
app.get('/test-db', async (req, res) => {
  try {
    // Intentamos obtener las tablas de tu base de datos
    const [rows] = await db.query('SHOW TABLES');
    res.json({
      message: "¡Conexión exitosa con XAMPP!",
      tables: rows
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al conectar con la base de datos",
      error: error
    });
  }
});
*/

export default app;
