const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const logLoginAttempt = require('./log');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const secretKey = process.env.JWT_SECRET_KEY; // Asegúrate de tener esta variable en tu archivo .env

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
      .select('id')
      .eq('usuario', username)
      .eq('pass', password)
      .single();

    if (error || !data) {
      await logLoginAttempt(username, password, ip, req.headers['user-agent'], 'Failed', country);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await logLoginAttempt(username, password, ip, req.headers['user-agent'], 'Success', country);

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({ message: 'Login successful' });
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

app.get('/api/secure-data', authMiddleware, (req, res) => {
  res.json({ message: 'This is secure data' });
});

app.get('/api/verify-token', authM
