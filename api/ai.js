const express = require('express');
const router = express.Router();

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: "gpt-3.5-turbo",  // Asegúrate de usar un modelo disponible
        messages: [
            { role: 'system', content: 'Eres un asistente especializado en viajes espaciales.' },
            { role: 'user', content: prompt }
        ]
    };

    try {
        // Importación dinámica de node-fetch para ES Modules
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
            const errorInfo = await response.json(); // Obtener el texto completo de la respuesta de error

            // Manejo específico del error de cuota insuficiente
            if (response.status === 429 && errorInfo.error && errorInfo.error.code === 'insufficient_quota') {
                console.error('Se ha excedido la cuota de la API de OpenAI:', errorInfo.error.message);
                return res.status(429).json({
                    error: 'Se ha excedido la cuota de la API de OpenAI. Por favor, intente más tarde o revise su plan de facturación.'
                });
            }

            throw new Error(`OpenAI API responded with status: ${response.status}, body was: ${JSON.stringify(errorInfo)}`);
        }

        const result = await response.json();
        res.json(result.choices[0].message.content);
    } catch (error) {
        console.error('Error al interactuar con la API de OpenAI:', error);
        res.status(500).json({ error: error.message || 'Error al procesar la solicitud' });
    }
});

module.exports = router;
