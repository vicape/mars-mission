const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function logLoginAttempt(username, password, ip, browser, status, country) {
  const time = new Date().toISOString();  // Obtener la fecha y hora actuales en formato ISO

  try {
    const { data, error } = await supabase
      .from('log')
      .insert([{ username, pass: password, time, ip, browser, status, country }]);

    if (error) {
      throw error;
    }

    console.log('Log inserted successfully:', data);
  } catch (error) {
    console.error('Error logging login attempt:', error.message);
  }
}

module.exports = logLoginAttempt;
