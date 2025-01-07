import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json());
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY // Ensure your API key is stored in .env
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        console.log('User message:', message);
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "deepseek-chat",
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get response from DeepSeek API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});