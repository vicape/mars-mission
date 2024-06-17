const { logLoginAttempt } = require('./log');

const testSupabaseConnection = async () => {
  const username = 'test_user';
  const password = 'test_password';
  const time = new Date().toISOString();
  const ip = '127.0.0.1';

  try {
    const result = await logLoginAttempt(username, password, time, ip);
    console.log('Data inserted successfully:', result);
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

testSupabaseConnection();
