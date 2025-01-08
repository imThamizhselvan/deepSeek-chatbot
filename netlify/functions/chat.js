const handler = async (event) => {
  const API_KEY = process.env.VITE_DEEPSEEK_API_KEY;
  const API_URL = 'https://api.deepseek.com/v1/chat/completions';

  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: event.body
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to API' })
    };
  }
};

module.exports = { handler }; 