// Importa el módulo 'createClient' de '@supabase/supabase-js' para interactuar con Supabase.
const { createClient } = require('@supabase/supabase-js');

// URL y clave pública del proyecto Supabase.
const supabaseUrl = 'https://yayrbsvafizrldmkxtvj.supabase.co';
const supabaseKey = 'tu_clave_publica_aqui';
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para probar la conexión a Supabase insertando un registro en la tabla 'log'.
const testSupabaseConnection = async () => {
  const { data, error } = await supabase
    .from('log')
    .insert([{ username: 'test_user', pass: 'test_password', time: new Date().toISOString(), ip: '127.0.0.1' }]);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted successfully:', data);
  }
};

// Ejecuta la función para probar la conexión.
testSupabaseConnection();
