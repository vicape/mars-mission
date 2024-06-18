const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const logLoginAttempt = require('./log');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('log')
      .select('*')
      .eq('username', username)
      .eq('pass', password); // Cambié de 'password' a 'pass' basado en la estructura de tu tabla

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      await logLoginAttempt(username, password, req.ip, req.headers['user-agent'], 'Success');
      res.json({ message: 'Login successful' });
    } else {
      await logLoginAttempt(username, password, req.ip, req.headers['user-agent'], 'Failed');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    await logLoginAttempt(username, password, req.ip, req.headers['user-agent'], 'Error');
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
