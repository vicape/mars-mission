import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // Crear un nuevo thread y enviar el mensaje
    const thread = await openai.threads.create({
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Ejecutar el thread usando el assistant ID
    const run = await openai.threads.runs.create({
      thread_id: thread.id,
      assistant_id: 'asst_WaBmHVv5hqSTelXf1azvBbJh'
    });

    // Obtener la lista de mensajes del thread
    const messages = await openai.threads.messages.list({
      thread_id: thread.id
    });

    // Extraer el contenido del mensaje de respuesta
    const assistantMessage = messages.data.find(message => message.role === 'assistant').content[0].text.value;
    
    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
}
