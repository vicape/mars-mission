const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const logLoginAttempt = require('./log');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
