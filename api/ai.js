const express = require('express');
const router = express.Router();
const fs = require('fs');
const pdf = require('pdf-parse');
const fetch = require('node-fetch');

// Cargar la clave API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Función para extraer texto de un PDF
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
}

// Almacenar el texto extraído del PDF en una variable
let marsInformation = '';
extractTextFromPDF('path_to_your_pdf.pdf').then(text => {
    marsInformation = text; // Almacena el texto para uso posterior
});

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: 'system', content: 'Soy un asistente especializado en viajes a Marte.' + marsInformation },
            { role: 'user', content: prompt }
        ]
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
