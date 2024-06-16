const express = require('express');
const logLoginAttempt = require('./log');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  try {
    await logLoginAttempt(username, password, ip);
    res.status(200).send('Login attempt logged successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
