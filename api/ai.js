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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Asegúrate de usar un modelo disponible
      messages: [
        { role: 'system', content: 'Eres un asistente especializado en informar y educar sobre viajes y exploración en Marte. Responde solo con información relacionada con Marte.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
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
