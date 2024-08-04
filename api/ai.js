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
    // Asegúrate de usar el método correcto según la última versión del SDK
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    });

    const assistantMessage = response.data.choices[0].text;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
});

module.exports = router;
