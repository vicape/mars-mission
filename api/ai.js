import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que esta variable está configurada en Vercel
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
    // ID del asistente
    const assistantId = "asst_q76Jk0ulOIGSW2eNcGuOnhaZ";

    // Crear un nuevo hilo
    const thread = await openai.chat.threads.create({
      assistant_id: assistantId,
      messages: [{ role: 'user', content: prompt }]
    });

    // Crear una ejecución para obtener la respuesta
    const run = await openai.chat.threads.runs.create({
      thread_id: thread.id,
      assistant_id: assistantId
    });

    // Hacer polling para obtener el resultado final
    let result;
    do {
      result = await openai.chat.threads.runs.retrieve({
        thread_id: thread.id,
        run_id: run.id
      });
    } while (result.status === 'in_progress');

    if (result.status === 'completed') {
      const finalMessages = await openai.chat.threads.messages.list({
        thread_id: thread.id
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
