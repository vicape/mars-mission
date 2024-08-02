const express = require('express');
const router = express.Router();

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Palabras clave para determinar si el prompt es relevante para Marte
const marsKeywords = ['marte', 'viaje a marte', 'colonización de marte', 'exploración de marte', 'misiones a marte'];

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    // Verificar si el prompt incluye palabras clave relacionadas con Marte
    const isAboutMars = marsKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    if (!isAboutMars) {
        return res.status(403).json({ error: 'This service only provides information about Mars.' });
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: "gpt-3.5-turbo",  // Asegúrate de usar un modelo disponible
        messages: [
            { role: 'system', content: 'Soy un asistente especializado en viajes a Marte.' },
            { role: 'user', content: prompt }
        ]
    };

    try {
        const fetch = (await import('node-fetch')).default;
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
