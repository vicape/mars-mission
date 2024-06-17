// Importa el módulo 'pg' para interactuar con PostgreSQL.
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL usando variables de entorno.
const pool = new Pool({
  user: process.env.DB_USER,      // Usuario de la base de datos
  host: process.env.DB_HOST,      // Host de la base de datos
  database: process.env.DB_NAME,  // Nombre de la base de datos
  password: process.env.DB_PASS,  // Contraseña de la base de datos
  port: process.env.DB_PORT,      // Puerto de la base de datos
});

// Exporta el pool de conexiones para que pueda ser usado en otros archivos.
module.exports = pool;
