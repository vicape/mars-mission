const express = require('express');
const router = express.Router();

// Asegúrate de tener tu clave API de OpenAI en tu archivo .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: "gpt-4o-mini",
        messages: [
            { role: 'system', content: 'Eres un asistente especializado en viajes espaciales.' },
            { role: 'user', content: prompt }
        ]
    };

    try {
        const fetch = (await import('node-fetch')).default;  // Import dinámico de node-fetch
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorInfo = await response.text(); // or response.json() if response is in JSON format
            throw new Error(`OpenAI API responded with status: ${response.status}, body was: ${errorInfo}`);
        }

        const result = await response.json();
        res.json(result.choices[0].message.content);
    } catch (error) {
        console.error('Error al interactuar con la API de OpenAI:', error);
        res.status(500).json({ error: error.message || 'Error al procesar la solicitud' });
    }
});

module.exports = router;
