import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que esta variable está configurada en Vercel
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    // ID del asistente
    const assistantId = "asst_q76Jk0ulOIGSW2eNcGuOnhaZ";

    // Crear un nuevo hilo y obtener respuesta
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant specialized in Mars exploration.' },
        { role: 'user', content: prompt }
      ]
    });

    // Respuesta del asistente
    const assistantMessage = chatCompletion.choices[0].message.content;
    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: error.message || 'Error processing request' });
  }
}
