import React, { useState, useRef } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      files: uploadedFiles,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I understand your request. Let me help you with that.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <h2>AI Assistant</h2>
          <span className="status-indicator">Online</span>
        </div>
        <div className="chat-actions">
          <button className="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              {message.files && message.files.length > 0 && (
                <div className="message-files">
                  {message.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-icon">📎</span>
                      <span className="file-name">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="uploaded-file">
                <span className="file-icon">📎</span>
                <span className="file-name">{file.name}</span>
                <button 
                  className="remove-file"
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="chat-input-wrapper">
          <div className="input-actions">
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Shift+Enter for new line)"
            className="chat-input"
            rows="1"
          />
          
          <button 
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && uploadedFiles.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
