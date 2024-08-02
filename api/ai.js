const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const pdf = require('pdf-parse');

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Función para descargar y extraer texto de un PDF desde un URL
async function extractTextFromPDF(pdfUrl) {
    const response = await fetch(pdfUrl);
    const dataBuffer = await response.buffer();
    const data = await pdf(dataBuffer);
    return data.text;
}

// URL del PDF en el almacenamiento en la nube
const pdfUrl = 'https://your-cloud-storage.com/path_to_your_pdf.pdf';

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    try {
        const marsInformation = await extractTextFromPDF(pdfUrl);

        const url = 'https://api.openai.com/v1/chat/completions';
        const data = {
            model: "gpt-3.5-turbo",  // Asegúrate de usar un modelo disponible
            messages: [
                { role: 'system', content: marsInformation }, // Agrega información extraída del PDF
                { role: 'user', content: prompt }
            ]
        };

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
