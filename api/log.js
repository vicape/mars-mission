// Importa los módulos necesarios.
const express = require('express');
const router = express.Router();
const pool = require('./db');

// Ruta para obtener todos los registros de la tabla 'log'.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM log');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para agregar un nuevo registro a la tabla 'log'.
router.post('/', async (req, res) => {
  try {
    const { username, pass, time, ip } = req.body;
    const result = await pool.query(
      'INSERT INTO log (username, pass, time, ip) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, pass, time, ip]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Exporta el enrutador para que pueda ser usado en otros archivos.
module.exports = router;
