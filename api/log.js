const fetch = require('node-fetch');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co/rest/v1/log';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';

const logLoginAttempt = async (username, ip, browser, status) => {
  try {
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        username: username,
        time: new Date().toISOString(),
        ip: ip,
        browser: browser,
        status: status
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Data inserted successfully:', data);
    return data;

  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

module.exports = logLoginAttempt;
