const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const logRouter = require('./log');
require('dotenv').config(); // Carga las variables de entorno desde un archivo .env.

const app = express();
const port = process.env.PORT || 3000; // Obtiene el puerto desde las variables de entorno o usa el puerto 3000 por defecto.

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de la misión a Marte');
});

app.use('/api/log', logRouter);

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
