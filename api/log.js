const express = require('express');
const router = express.Router();
const pool = require('./db');
const ipinfo = require('ipinfo');
require('dotenv').config();

async function getCountry(ip) {
  return new Promise((resolve, reject) => {
    ipinfo(ip, (err, cLoc) => {
      if (err) {
        console.error('Error getting country information:', err);
        return resolve("Unknown");
      }
      resolve(cLoc.country || "Unknown");
    });
  });
}

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const browser = req.headers['user-agent'];

  try {
    const country = await getCountry(ip);
    console.log(`Country fetched: ${country}`);

    const userResponse = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1 AND pass = $2',
      [username, password]
    );

    const loginStatus = userResponse.rows.length > 0 ? 'Success' : 'Failed';

    await pool.query(
      'INSERT INTO log (username, password, ip, browser, status, country) VALUES ($1, $2, $3, $4, $5, $6)',
      [username, password, ip, browser, loginStatus, country]
    );

    res.status(200).json({ message: `Login ${loginStatus}` });
  } catch (error) {
    console.error('Error processing login:', error.message);
    res.status(500).json({ error: 'Error processing login request' });
  }
});

module.exports = router;
