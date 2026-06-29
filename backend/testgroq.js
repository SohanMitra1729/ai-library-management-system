import 'dotenv/config';
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant."
                },
                {
                    role: "user",
                    content: "Introduce yourself in one sentence."
                }
            ],
            temperature: 0.7,
            max_tokens: 100
        });

        console.log("✅ Groq Response:");
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error("❌ Groq Test Failed:");
        console.error(error);
    }
}

testGroq();