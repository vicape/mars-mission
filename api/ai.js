const express = require('express');
const OpenAI = require('openai');
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
    const response = await openai.assistants.threads.create({
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ",  // Utilizar el ID del asistente personalizado
      messages: [
        { role: 'system', content: 'Start' },  // Mensaje de inicio para el asistente
        { role: 'user', content: prompt }
      ],
      configuration: {
        model: "gpt-3.5-turbo-0125", // Usa un modelo disponible y específico si es necesario
        temperature: 0.7,
        top_p: 1.0
      }
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
