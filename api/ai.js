const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Crear una instancia del cliente OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // Crear una consulta al asistente personalizado
    const response = await openai.assistants.createChatCompletion({
      assistantId: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ",  // Usar el ID del asistente personalizado
      messages: [
        { role: 'system', content: 'Start' },  // Mensaje inicial para el asistente
        { role: 'user', content: prompt }
      ],
      model: "gpt-3.5-turbo-0125",  // Especifica el modelo si es necesario
      temperature: 0.7,
      maxTokens: 150,
      topP: 1.0
    });

    // Extraer el contenido de la respuesta del asistente
    const assistantMessage = response.choices[0].message.content;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

module.exports = router;
