const express = require('express');
const router = express.Router();

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    // URL actualizada para el endpoint de asistentes con el ID del asistente
    const url = 'https://api.openai.com/v1/assistants/asst_q76JkOu1OlGSW2eNcGuOnhaZ';

    // Ajustar la estructura de datos para enviar el mensaje al asistente
    const data = {
        messages: [
            { role: 'system', content: 'Start' },
            { role: 'user', content: prompt }
        ]
    };

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'  // Incluir el encabezado requerido por la API
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorInfo = await response.json();
            throw new Error(`OpenAI API responded with status: ${response.status}, body was: ${JSON.stringify(errorInfo)}`);
        }

        const result = await response.json();
        // Ajusta el acceso a los datos según la estructura exacta de la respuesta
        res.json(result.data);
    } catch (error) {
        console.error('Error interacting with OpenAI API:', error);
        res.status(500).json({ error: error.message || 'Error processing request' });
    }
});

module.exports = router;
