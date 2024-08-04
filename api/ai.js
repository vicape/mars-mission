const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function main() {
  try {
    // Crear un thread con el asistente
    const threadResponse = await openai.createThread({
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    const threadId = threadResponse.data.id;

    // Enviar un mensaje al thread creado con el asistente
    const messageResponse = await openai.createMessage({
      thread_id: threadId,
      model: "gpt-3.5-turbo",
      messages: [{
        role: 'user',
        content: "Can you explain the implications of quantum computing on encryption?"
      }]
    });

    // Suponiendo que necesitamos ejecutar el asistente para obtener la respuesta
    const runResponse = await openai.createRun({
      thread_id: threadId,
      assistant_id: "asst_q76Jk0ulOIGSW2eNcGuOnhaZ"
    });

    console.log("Response from Assistant:", runResponse.data);

  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
  }
}

main();
