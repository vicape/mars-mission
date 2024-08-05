const axios = require('axios');

const openaiApi = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
    }
});

// Función para crear un nuevo thread
async function createThread(assistantId) {
    try {
        const response = await openaiApi.post('/threads', {
            assistant_id: assistantId
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear thread:', error.response?.data || error.message);
        return null;
    }
}

// Función para enviar un mensaje a un thread específico
async function sendMessage(threadId, message) {
    try {
        const response = await openaiApi.post(`/threads/${threadId}/messages`, {
            messages: [{
                role: "user",
                content: message
            }]
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar mensaje:', error.response?.data || error.message);
        return null;
    }
}

// Ejemplo de uso de las funciones
async function interactWithAssistant() {
    const assistantId = 'tu-assistant-id'; // Reemplaza con el ID de tu asistente
    const thread = await createThread(assistantId);

    if (thread && thread.id) {
        const threadId = thread.id;
        const userMessage = "¿Cuál es tu función?"; // Supongamos que esto viene del frontend
        const messageResponse = await sendMessage(threadId, userMessage);

        console.log('Respuesta del assistant:', messageResponse);
        // Aquí enviarías la respuesta de vuelta al frontend
    }
}

// Llamar a la función principal para iniciar la interacción
interactWithAssistant();
