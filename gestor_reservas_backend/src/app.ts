//app.ts El corazon del backend

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; //Conecta las rutas de auth a la app
import courtRoutes from './routes/court.routes'; //Conecta las rutas de court a la app
import reservationRoutes from './routes/reservation.routes'; //Conecta las rutas del sistema de reservas a la app


//IMPORT PARA LA RUTA DE PRUEBA MAS ABAJO
//import { db } from './config/database';

// Inicializamos la aplicación Express
const app = express();

/**
 * MIDDLEWARES GLOBALES
 */
// Habilita el Intercambio de Recursos de Origen Cruzado (CORS) para permitir peticiones desde el Frontend
app.use(cors());
// Permite que el servidor entienda y procese archivos en formato JSON
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
