document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');
    const themeToggle = document.getElementById('theme-toggle');
    const chatList = document.getElementById('chat-list');
    const newChatButton = document.getElementById('new-chat');

    // Chat history management
    let currentChatId = null;
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    function createNewChat() {
        const chatId = Date.now().toString();
        const newChat = {
            id: chatId,
            title: 'New Chat',
            messages: []
        };
        chatHistory.unshift(newChat);
        currentChatId = chatId;
        saveChatHistory();
        updateChatList();
        clearMessages();
    }

    function updateChatList() {
        chatList.innerHTML = '';
        chatHistory.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
            chatItem.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                ${chat.title}
            `;
            chatItem.addEventListener('click', () => loadChat(chat.id));
            chatList.appendChild(chatItem);
        });
    }

    function loadChat(chatId) {
        currentChatId = chatId;
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            clearMessages();
            chat.messages.forEach(msg => {
                addMessage(msg.content, msg.sender, false);
            });
            updateChatList();
        }
    }

    function saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    function clearMessages() {
        messagesContainer.innerHTML = '';
        addMessage('Hello! How can I help you today?', 'bot', false);
    }

    function updateChatTitle(chatId, firstMessage) {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat && chat.title === 'New Chat') {
            chat.title = firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '');
            saveChatHistory();
            updateChatList();
        }
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Send message on Enter (Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        if (!currentChatId) {
            createNewChat();
        }

        // Add user message to chat
        addMessage(message, 'user');
        messageInput.value = '';
        messageInput.style.height = 'auto';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            addMessage(data.reply, 'bot');

            // Update chat title with first message
            updateChatTitle(currentChatId, message);
        } catch (error) {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    function addMessage(content, sender, save = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (save && currentChatId) {
            const chat = chatHistory.find(c => c.id === currentChatId);
            if (chat) {
                chat.messages.push({ content, sender });
                saveChatHistory();
            }
        }
    }

    // Event Listeners
    newChatButton.addEventListener('click', createNewChat);

    // Initialize
    if (chatHistory.length === 0) {
        createNewChat();
    } else {
        loadChat(chatHistory[0].id);
    }
}); 