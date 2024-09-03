// backend/openaiConfig.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Assurez-vous que cette variable d'environnement est définie
});

export default openai;
