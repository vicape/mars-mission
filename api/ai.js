const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const router = express.Router();

// Configuración del cliente OpenAI con la clave API
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
    // Usar el método 'createMessage' del objeto 'threads' para interactuar con un asistente
    const thread = await openai.assistants.threads.create({
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    const message = await openai.assistants.threads.messages.create({
      thread_id: thread.data.id,
      messages: [
        { role: 'system', content: 'Eres un asistente especializado en informar y educar sobre viajes y exploración en Marte. Responde solo con información relacionada con Marte.' },
        { role: 'user', content: prompt }
      ]
    });

    const response = await openai.assistants.threads.runs.create({
      thread_id: thread.data.id,
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    // Espera a que el asistente complete la ejecución
    while (response.data.status === 'in_progress' || response.data.status === 'queued') {
      response = await openai.assistants.threads.runs.retrieve({
        thread_id: thread.data.id,
        run_id: response.data.id
      });
    }

    const finalResponse = response.data.messages.pop();  // Obtener la última respuesta del asistente
    res.json({ message: finalResponse.content });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

module.exports = router;
