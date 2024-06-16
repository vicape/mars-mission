const express = require('express');
const axios = require('axios');
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

app.get('/api', (req, res) => {
  res.send('Welcome to the Mars Mission API');
});

app.get('/api/users', async (req, res) => {
  try {
    console.log('Fetching CSV file...');
    const response = await axios.get('https://mars2024.000webhostapp.com/users.csv');
    const data = response.data;
    console.log('CSV file fetched successfully.');
    const users = data.split('\n').slice(1).map(line => {
      const [name, age, email] = line.split(',');
      return { name, age, email };
    }).filter(user => user.name && user.age && user.email);
    console.log('Parsed users:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching the CSV file:', error);
    res.status(500).json({ error: 'Error fetching the CSV file' });
  }
});

// Endpoint para el intento de inicio de sesión
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
