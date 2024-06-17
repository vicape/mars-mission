const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const logLoginAttempt = require('./log');
const ipinfo = require('ipinfo');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';

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

  try {
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/usuarios?usuario=eq.${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error(`Error fetching user information: ${errorText}`);
      throw new Error(`Error fetching user information: ${errorText}`);
    }

    const userData = await userResponse.json();
    console.log(`User data fetched: ${JSON.stringify(userData)}`);

    if (userData.length === 0 || userData[0].pass !== password) {
      console.log('Invalid credentials');
      return { success: false, message: 'Invalid credentials' };
    }

    return { success: true, message: 'Login successful' };

  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const browser = req.headers['user-agent'];

  try {
    console.log(`Login attempt by username: ${username}, IP: ${ip}, Browser: ${browser}`);
    
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
