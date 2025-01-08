const API_KEY = process.env.VITE_DEEPSEEK_API_KEY;

const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const sendMessage = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
        model: "deepseek-chat",
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 