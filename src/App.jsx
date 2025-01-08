import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatHistory from './components/ChatHistory';
import ThemeToggle from './components/ThemeToggle';
import './App.css';
import { sendMessage as apiSendMessage } from './services/api';

function App() {
  const [chatHistory, setChatHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('chatHistory')) || [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const textareaRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      createNewChat();
    } else if (!currentChatId) {
      setCurrentChatId(chatHistory[0].id);
    }
  }, []);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const updateChatTitle = (chatId, firstMessage) => {
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === chatId && chat.title === 'New Chat') {
        return {
          ...chat,
          title: firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '')
        };
      }
      return chat;
    }));
  };

  const addMessage = (content, sender) => {
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { content, sender }]
        };
      }
      return chat;
    }));
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    addMessage(message, 'user');
    setMessage('');

    try {
      const reply = await apiSendMessage(message);
      addMessage(reply, 'bot');
      updateChatTitle(currentChatId, message);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage(`Error: ${error.message}. Please try again.`, 'bot');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentChat = chatHistory.find(chat => chat.id === currentChatId);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="new-chat-btn" onClick={createNewChat}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>
        </div>
        <ChatHistory
          chats={chatHistory}
          currentChatId={currentChatId}
          onChatSelect={setCurrentChatId}
        />
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Chatbot powered by DeepSeek</h1>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          />
        </div>

        <div className="messages">
          {currentChat?.messages.map((msg, index) => (
            <ChatMessage
              key={index}
              content={msg.content}
              sender={msg.sender}
            />
          ))}
        </div>

        <div className="input-area">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            rows="1"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App; 