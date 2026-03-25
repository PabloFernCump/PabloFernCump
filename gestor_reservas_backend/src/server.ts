// ¡IMPORTANTE! dotenv.config() debe ser la PRIMERA línea de ejecución
require('dotenv').config(); // Usar require fuerza la ejecución inmediata

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en port ${PORT}`);
  // Añado este console.log temporal para verificar que lee la clave (solo los primeros caracteres por seguridad)
  console.log(`💳 Stripe configurado: ${process.env.STRIPE_SECRET_KEY ? 'SÍ (Clave cargada)' : 'NO (Error en .env)'}`);
});
