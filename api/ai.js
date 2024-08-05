const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Ruta para iniciar el chat con el asistente
app.post('/chat-with-assistant', async (req, res) => {
    const { message } = req.body;

    try {
        // Crear un thread
        const thread = await openai.threads.create({
            assistant_id: 'asst_WaBmHVv5hqSTelXf1azvBbJh',  // Reemplaza con tu Assistant ID
        });

        // Añadir un mensaje al thread
        const response = await openai.threads.messages.create(thread.data.id, {
            messages: [
                { role: "user", content: message }
            ]
        });

        // Opcional: ejecutar el thread para obtener la respuesta
        const run = await openai.threads.runs.create(thread.data.id);

        // Esperar y obtener las respuestas completas
        const messages = await openai.threads.messages.list(thread.data.id);

        // Enviar la última respuesta del asistente
        const lastMessage = messages.data[messages.data.length - 1];
        res.json({ message: lastMessage.content });
    } catch (error) {
        console.error('Error interacting with OpenAI:', error);
        res.status(500).send('Error processing your request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
