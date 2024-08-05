// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const logLoginAttempt = require('./log');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const missionRoutes = require('./mission');  // Rutas para las misiones
const aiRoutes = require('./ain');  // Añadido para incluir las rutas de OpenAI

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const secretKey = process.env.JWT_SECRET_KEY; // Asegúrate de tener esta variable en tu archivo .env

if (!secretKey) {
  console.error('JWT_SECRET_KEY is not defined in the environment variables');
  process.exit(1); // Detiene la aplicación si no se encuentra la clave secreta
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let country = 'EMPTY';

  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    country = response.data.country || 'EMPTY';
  } catch (error) {
    console.error('Error fetching country:', error.message);
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, team, school')
      .eq('usuario', username)
      .eq('pass', password)
      .single();

    if (error) {
      console.error('Error fetching user from database:', error.message);
      await logLoginAttempt(username, password, ip, req.headers['user-agent'], 'Failed', country);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!data) {
      console.log('User not found or invalid credentials');
      await logLoginAttempt(username, password, ip, req.headers['user-agent'], 'Failed', country);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await logLoginAttempt(username, password, ip, req.headers['user-agent'], 'Success', country);

    const token = jwt.sign({ username, team: data.team, school: data.school }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({
      message: 'Login successful',
      user: {
        username,
        team: data.team,
        school: data.school
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

// Añadir nuevas rutas
app.use('/api/mission', missionRoutes);
app.use('/api/ai', aiRoutes);  // Usar las rutas de AI

app.get('/api/secure-data', authMiddleware, (req, res) => {
  res.json({ message: 'This is secure data', user: req.user });
});

app.get('/api/verify-token', authMiddleware, (req, res) => {
  res.json({ message: 'Authenticated', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
