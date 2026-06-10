const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.warn("⚠️ GEMINI_API_KEY is not set correctly. AI features will not work.");
}

module.exports = genAI;
