const express = require('express');
const { OpenAIApi, Configuration } = require('openai');
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
    // Llamada al método correcto para crear una chat completion
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",  // Usa el modelo correcto
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
    const assistantMessage = response.data.choices[0].message.content;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

module.exports = router;
