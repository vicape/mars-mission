const express = require('express');
const logLoginAttempt = require('./log');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para obtener la IP del cliente y procesar datos JSON
app.use((req, res, next) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
});
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.clientIp;

  try {
    await logLoginAttempt(username, password, ip);
    res.status(200).json({ message: 'Login attempt logged' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging login attempt' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
