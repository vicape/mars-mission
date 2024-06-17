const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';
const supabase = createClient(supabaseUrl, supabaseKey);

const logLoginAttempt = async (username, password) => {
  const { data, error } = await supabase
    .from('log')
    .insert([{ username, pass: password, time: new Date().toISOString(), ip: '127.0.0.1' }]);

  if (error) {
    throw error;
  }
  return data;
};

module.exports = logLoginAttempt;
