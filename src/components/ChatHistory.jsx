const ChatHistory = ({ chats, currentChatId, onChatSelect }) => {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
          onClick={() => onChatSelect(chat.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {chat.title}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory; 