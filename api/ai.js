const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Asegúrate de tener 'node-fetch' en tus dependencias

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    const url = `https://api.openai.com/v1/assistants/asst_q76Jk0ulOIGSW2eNcGuOnhaZ/messages`;
    const data = {
        model: "gpt-3.5-turbo", // Asegúrate de que el modelo coincide con el disponible para tu asistente
        inputs: {
            messages: [
                { role: 'user', content: prompt }
            ]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorInfo = await response.json();
            throw new Error(`OpenAI API responded with status: ${response.status}, body was: ${JSON.stringify(errorInfo)}`);
        }

        const result = await response.json();
        res.json(result.choices[0].message.content);
    } catch (error) {
        console.error('Error interacting with OpenAI API:', error);
        res.status(500).json({ error: error.message || 'Error processing request' });
    }
});

module.exports = router;
