const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Ruta para la URL raíz
app.get('/', (req, res) => {
  res.send('Welcome to the Mars Mission API');
});

// Ruta para obtener los usuarios del archivo CSV
app.get('/users', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
