const express = require('express');
const axios = require('axios');
const router = express.Router();

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // URL del endpoint para interactuar con el asistente personalizado
    const url = `https://api.openai.com/v1/assistants/asst_q76Jk0ulOIGSW2eNcGuOnhaZ/threads`;

    // Estructura de la solicitud
    const data = {
      messages: [
        { role: 'system', content: 'Start' },  // Inicia el thread
        { role: 'user', content: prompt }
      ],
      configuration: {
        model: "gpt-3.5-turbo-0125",
        temperature: 0.7,
        top_p: 1.0
      }
    };

    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'  // Asegúrate de incluir este encabezado si es necesario
      }
    });

    // Extraer el contenido de la respuesta del asistente
    const assistantMessage = response.data.choices[0].message.content;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

module.exports = router;
