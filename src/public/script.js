document.getElementById('send').addEventListener('click', async () => {
    const message = document.getElementById('message').value;

    const response = await fetch('/chat', { // Call your server endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        const error = await response.json();
        document.getElementById('response').innerText = `Error: ${error.message}`;
        return;
    }

    const data = await response.json();
    document.getElementById('response').innerText = data.reply;
});