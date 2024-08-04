// Importa las clases necesarias del paquete 'openai'
const { Configuration, OpenAIApi } = require('openai');

// Crea la configuración con tu clave API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Inicializa la API de OpenAI con la configuración
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Llama a la API de OpenAI para obtener una respuesta
    const completion = await openai.createCompletion({
      model: "text-davinci-002", // Asegúrate de cambiar esto por tu modelo correcto
      prompt: prompt,
      max_tokens: 150,
    });

    res.status(200).json({ message: completion.data.choices[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
};
