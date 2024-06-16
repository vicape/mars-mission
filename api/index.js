const express = require('express');
const logLoginAttempt = require('./log');

const app = express();
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    await logLoginAttempt(username, password);
    res.status(200).send('Login logged');
  } catch (error) {
    console.error('Error logging login attempt:', error);
    res.status(500).json({ error: 'Error logging login attempt' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
