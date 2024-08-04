// /api/chat.js

const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).send({ error: 'No prompt provided' });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    // Asegúrate de usar el ID correcto de tu asistente
    const threadResponse = await openai.createThread({
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    const messageResponse = await openai.createMessage({
      thread_id: threadResponse.data.id,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Suponiendo que la respuesta es inmediata y no necesita una ejecución adicional
    res.status(200).send({ message: messageResponse.data.choices[0].message.content });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).send({ error: 'Error processing request' });
  }
};
