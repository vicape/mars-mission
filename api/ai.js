const { OpenAI } = require("openai");

const apiKey = process.env.OPENAI_API_KEY; // Asegúrate de que la clave API está configurada en tu entorno
const openai = new OpenAI(apiKey);

async function queryOpenAI() {
  try {
    const response = await openai.Completion.create({
      model: "gpt-3.5-turbo",
      prompt: "What are the major impacts of climate change?",
      max_tokens: 100
    });

    console.log("Response from OpenAI:", response.choices[0].text);
  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
  }
}

queryOpenAI();
