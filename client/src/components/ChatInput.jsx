import React, { useState, useRef } from 'react';
import "../styles.css";

const ChatInput = ({ 
  onSendMessage, 
  onTyping, 
  isAdmin = false, 
  isBroadcast = false 
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile)) return;

    setIsUploading(true);
    try {
      if (isBroadcast) {
        await onSendMessage(message);
      } else {
        await onSendMessage({
          message: message,
          file: selectedFile
        });
      }

      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending neural transmission:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (onTyping) onTyping();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('>> ERROR: Neural data packet too large. Maximum size: 10MB');
        return;
      }
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('>> ERROR: Unsupported neural data format. Allowed: Images, PDF, TXT, DOC');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getPlaceholderText = () => (isBroadcast ? '>> ENTER_SYSTEM_BROADCAST...' : '>> ENTER_NEURAL_MESSAGE...');
  const getSendButtonContent = () => (isUploading ? '...' : isBroadcast ? '📢' : '>>');

  return (
    <div className="chat-input-container">
      {selectedFile && (
        <div className="selected-file-preview">
          <div className="file-info">
            <span className="file-icon">{selectedFile.type.startsWith('image/') ? '🖼️' : '📎'}</span>
            <span className="file-name">NEURAL_FILE: {selectedFile.name}</span>
            <span className="file-size">({(selectedFile.size / 1024).toFixed(1)}KB)</span>
          </div>
          <button className="remove-file-btn" onClick={removeSelectedFile} type="button">×</button>
        </div>
      )}

      <div className="input-controls">
        <div className="text-input-wrapper">
          <textarea
            className="message-input"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholderText()}
            disabled={isUploading}
            rows={1}
            style={{resize: 'none', overflow: 'hidden', minHeight: '50px', maxHeight: '120px'}}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        <div className="input-buttons">
          {isAdmin && !isBroadcast && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                id="file-input"
                hidden
                onChange={handleFileSelect}
                accept="image/*,.pdf,.txt,.doc,.docx"
                disabled={isUploading}
              />
              <button
                className="file-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                type="button"
                title="Attach neural data"
              >
                📎
              </button>
            </>
          )}

          <button
            className={`send-btn ${isBroadcast ? 'broadcast-btn' : ''}`}
            onClick={handleSendMessage}
            disabled={isUploading || (!message.trim() && !selectedFile)}
            type="button"
            title={isBroadcast ? 'Broadcast to all neural links' : 'Send neural transmission'}
          >
            {getSendButtonContent()}
          </button>
        </div>
      </div>

      <div className="input-status">
        {isUploading && (
          <div className="uploading-indicator">
            <span className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
            <span className="status-text">Transmitting neural data...</span>
          </div>
        )}

        {!isUploading && (
          <div className="input-hints">
            <span className="hint">{isBroadcast ? 'BROADCAST_MODE_ACTIVE' : 'ENTER: Send | SHIFT+ENTER: New line'}</span>
            {isAdmin && !isBroadcast && <span className="hint file-hint">| 📎: Attach files</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
