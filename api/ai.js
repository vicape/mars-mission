import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que esta variable de entorno está configurada en Vercel
});

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // Usa el ID de tu asistente específico
    const assistantId = "asst_q76Jk0ulOIGSW2eNcGuOnhaZ";

    // Crea un hilo para el asistente
    const thread = await openai.threads.create({
      assistant_id: assistantId,
    });

    console.log('Thread created:', thread.id);

    // Añade un mensaje al hilo
    const message = await openai.threads.messages.create({
      thread_id: thread.id,
      role: 'user',
      content: prompt,
    });

    console.log('Message sent:', message.id);

    // Ejecuta el asistente y espera la respuesta
    const run = await openai.threads.runs.create({
      thread_id: thread.id,
      assistant_id: assistantId,
    });

    console.log('Run started:', run.id);

    // Polling for the result
    let result;
    do {
      result = await openai.threads.runs.retrieve({
        thread_id: thread.id,
        run_id: run.id,
      });
    } while (result.status === 'in_progress');

    if (result.status === 'completed') {
      const finalMessages = await openai.threads.messages.list({
        thread_id: thread.id,
      });

      const responseMessage = finalMessages.data.slice(-1)[0].content;
      res.status(200).json({ message: responseMessage });
    } else {
      res.status(500).json({ error: 'Failed to complete the assistant run' });
    }
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
};
