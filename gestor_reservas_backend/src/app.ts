import express from 'express';
import cors from 'cors';

//import { db } from './config/database';

const app = express();

app.use(cors());
app.use(express.json());

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
