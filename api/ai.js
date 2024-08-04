const OpenAI = require('openai').default;  // Asegúrate de requerir correctamente si usas `default`

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  try {
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: "How does AI work? Explain it in simple terms.",
      max_tokens: 150
    });

    console.log(response.data.choices[0].text);
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
  }
}

main();
