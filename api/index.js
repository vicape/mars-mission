const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const logLoginAttempt = require('./log');
const ipinfo = require('ipinfo'); // Añadir ipinfo para capturar el país

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q'; // Clave de Supabase

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const browser = req.headers['user-agent'];

  try {
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/usuarios?username=eq.${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      if (userData.length > 0 && userData[0].password === password) {
        // Obtener país usando ipinfo
        ipinfo(ip, async (err, cLoc) => {
          let country = "Unknown";
          if (!err && cLoc && cLoc.country) {
            country = cLoc.country;
          } else {
            console.error('Error getting country information:', err);
          }
          await logLoginAttempt(username, password, ip, browser, "Success", country);
          res.status(200).json({ message: 'Login successful' });
        });
      } else {
        await logLoginAttempt(username, password, ip, browser, "Failed", "Unknown");
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      await logLoginAttempt(username, password, ip, browser, "Failed", "Unknown");
      res.status(500).json({ error: 'Error fetching user information' });
    }
  } catch (error) {
    console.error('Error processing login:', error);
    await logLoginAttempt(username, password, ip, browser, "Failed", "Unknown");
    res.status(500).json({ error: 'Error processing login request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
