const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // Crear un nuevo thread para manejar la conversación
    const thread = await openai.threads.create({
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    // Enviar el mensaje del usuario al asistente dentro del thread
    const message = await openai.threads.messages.create({
      thread_id: thread.data.id,
      model: "gpt-3.5-turbo",
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Procesar y esperar la respuesta del asistente
    const run = await openai.threads.runs.create({
      thread_id: thread.data.id,
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    // Esperar hasta que la ejecución esté completa para obtener la respuesta final
    const finalRun = await openai.threads.runs.retrieve({
      thread_id: thread.data.id,
      run_id: run.data.id
    });

    // Recuperar todos los mensajes después de la respuesta del asistente
    const messages = await openai.threads.messages.list({
      thread_id: thread.data.id
    });

    // Enviar la respuesta del asistente al cliente
    res.json({ messages: messages.data });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

module.exports = router;
