const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para registrar el intento de inicio de sesión
const logLoginAttempt = async (username, pass, ip) => {
  const time = new Date().toISOString();

  const { data, error } = await supabase
    .from('log')
    .insert([
      { username, pass, time, ip }
    ]);

  if (error) {
    console.error('Error logging login attempt:', error);
  } else {
    console.log('Login attempt logged successfully:', data);
  }
};

module.exports = logLoginAttempt;
