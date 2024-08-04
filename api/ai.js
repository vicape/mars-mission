const express = require('express');
const router = express.Router();

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    // URL del endpoint de los asistentes
    const url = 'https://api.openai.com/v1/assistants/asst_q76JkOu1OlGSW2eNcGuOnhaZ/threads';

    // Ajuste del cuerpo de la solicitud para incluir las nuevas capacidades
    const data = {
        messages: [
            { role: 'user', content: prompt }
        ],
        configuration: {
            model: "gpt-3.5-turbo-0125", // Usar el modelo afinado si es necesario
            temperature: 0.7,            // Ajusta según la creatividad deseada
            response_format: "json",
            top_p: 0.9
        }
    };

    try {
        // Importación dinámica de node-fetch para ES Modules
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'  // Asegúrate de incluir este encabezado
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorInfo = await response.json();
            throw new Error(`OpenAI API responded with status: ${response.status}, body was: ${JSON.stringify(errorInfo)}`);
        }

        const result = await response.json();
        // Ajusta el acceso a los datos según la estructura de respuesta
        res.json(result.choices[0].message.content); // Verifica la estructura exacta de la respuesta
    } catch (error) {
        console.error('Error interacting with OpenAI API:', error);
        res.status(500).json({ error: error.message || 'Error processing request' });
    }
});

module.exports = router;
