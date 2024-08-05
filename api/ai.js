import OpenAI from 'openai';

// Inicializa OpenAI con tu API key
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
    // Crea un nuevo hilo y envía el mensaje
    const thread = await openai.threads.create({
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Ejecuta el hilo usando el ID del asistente
    const run = await openai.threads.runs.create({
      thread_id: thread.id,
      assistant_id: 'asst_WaBmHVv5hqSTelXf1azvBbJh'
    });

    // Espera hasta que el run esté completo
    let runStatus = await openai.threads.runs.retrieve({
      thread_id: thread.id,
      run_id: run.id
    });

    while (runStatus.status !== 'completed') {
      await new Promise(res => setTimeout(res, 1000));
      runStatus = await openai.threads.runs.retrieve({
        thread_id: thread.id,
        run_id: run.id
      });
    }

    // Obtener la lista de mensajes del hilo
    const messages = await openai.threads.messages.list({
      thread_id: thread.id
    });

    // Extraer el contenido del mensaje de respuesta
    const assistantMessage = messages.data.find(message => message.role === 'assistant').content[0].text.value;

    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
}