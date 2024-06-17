const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
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

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const browser = req.headers['user-agent'];

  try {
    console.log(`Fetching user information for username: ${username}`);
    
    // Ajustar el nombre de la columna en la consulta para que coincida con la base de datos
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/usuarios?usuario=eq.${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(`Error fetching user information: ${errorText}`);
    }

    const userData = await userResponse.json();
    console.log(`User data fetched: ${JSON.stringify(userData)}`);

    if (userData.length === 0 || userData[0].pass !== password) {
      await logLoginAttempt(username, password, ip, browser, "Failed", "Unknown");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const country = await getCountry(ip);
    console.log(`Country fetched: ${country}`);

    await logLoginAttempt(username, password, ip, browser, "Success", country);
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error processing login:', error.message);
    await logLoginAttempt(username, password, ip, browser, "Failed", "Unknown");
    return res.status(500).json({ error: 'Error processing login request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
