// api/mission.js
const express = require('express');
const pool = require('./db');

const router = express.Router();

router.get('/fecha-inicio', async (req, res) => {
  try {
    const result = await pool.query('SELECT fecha_inicio FROM mission WHERE id = $1', [1]); // Asumiendo que quieres el registro con id = 1
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching fecha_inicio:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
