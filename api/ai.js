const express = require('express');
const OpenAI = require('openai');  // Cambio aquí si el destructuring no funciona
const router = express.Router();

const configuration = new OpenAI.Configuration({  // Cambio aquí
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAI.OpenAIApi(configuration);  // Cambio aquí

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
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
