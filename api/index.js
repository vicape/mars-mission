const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const logLoginAttempt = require('./log');
const ipinfo = require('ipinfo');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q'; // Clave de Supabase

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

async function loginUser(username, password) {
  console.log(`Fetching user information for username: ${username}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  let { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('usuario', username);

  if (error) {
    throw new Error(`Error fetching user information: ${error.message}`);
  }

  console.log(`User data fetched: ${JSON.stringify(usuarios)}`);

  if (usuarios.length === 0 || usuarios[0].pass !== password) {
    return { success: false, message: 'Invalid credentials' };
  }

  return { success: true, message: 'Login successful' };
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const browser = req.headers['user-agent'];

  try {
    const country = await getCountry(ip);
    console.log(`Country fetched: ${country}`);

    const loginResult = await loginUser(username, password);
    await logLoginAttempt(username, password, ip, browser, loginResult.success ? "Success" : "Failed", country);

    if (!loginResult.success) {
      return res.status(401).json({ error: loginResult.message });
    }

    return res.status(200).json({ message: loginResult.message });
  } catch (error) {
    console.error('Error processing login:', error.message);
    return res.status(500).json({ error: 'Error processing login request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
