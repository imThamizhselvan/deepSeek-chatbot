const ChatMessage = ({ content, sender }) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-content">{content}</div>
    </div>
  );
};

export default ChatMessage; 