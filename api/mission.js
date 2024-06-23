// api/mission.js
const express = require('express');
const pool = require('./db');

const router = express.Router();

router.get('/fecha-inicio', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT EXTRACT(EPOCH FROM (NOW() - fecha_inicio)) AS diff_seconds
      FROM mission
      WHERE id = $1
    `, [1]); // Asumiendo que quieres el registro con id = 1

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const diffSeconds = result.rows[0].diff_seconds;
    const days = Math.floor(diffSeconds / (24 * 3600));
    const hours = Math.floor((diffSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = Math.floor(diffSeconds % 60);

    res.json({ 
      diff: `${days} días: ${hours} horas: ${minutes} minutos: ${seconds} segundos`
    });
  } catch (error) {
    console.error('Error fetching fecha_inicio:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
