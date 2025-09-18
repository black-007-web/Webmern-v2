// Frontend/src/components/ChatMessage.jsx - Individual message component
import React from 'react';
import "../styles.css";

const ChatMessage = ({ message, currentUser, isAdmin = false, onDelete }) => {
  if (message.isDeleted) return null;

  const isOwnMessage = message.sender._id === currentUser._id;
  const isSystemAdmin = message.sender.isAdmin;
  const isAnnouncement = message.isAnnouncement;

  const handleDelete = () => {
    if (window.confirm('>> CONFIRM: Purge this neural data?')) {
      onDelete(message._id);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatSenderName = (sender) => {
    if (sender.isAdmin) return 'SYSTEM_ADMIN';
    return sender.name?.toUpperCase().replace(/\s+/g, '_') || 'UNKNOWN_USER';
  };

  const renderFileContent = () => {
    if (!message.fileUrl) return null;

    const fileUrl = `http://localhost:5000${message.fileUrl}`;
    
    if (message.fileType?.startsWith('image/')) {
      return (
        <div className="message-file image-file">
          <img 
            src={fileUrl} 
            alt="Neural data transmission" 
            className="message-image"
            loading="lazy"
          />
        </div>
      );
    } else {
      return (
        <div className="message-file document-file">
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="file-link"
          >
            <span className="file-icon">📎</span>
            <span className="file-name">
              {message.fileName || 'NEURAL_FILE_DATA'}
            </span>
          </a>
        </div>
      );
    }
  };

  return (
    <div className={`
      message 
      ${isOwnMessage ? 'own' : ''} 
      ${isAnnouncement ? 'announcement' : ''}
      ${isSystemAdmin ? 'system-message' : ''}
    `}>
      <div className="message-avatar">
        {isSystemAdmin ? '⚡' : message.sender.name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className={`sender-name ${isSystemAdmin ? 'system-sender' : ''}`}>
            {formatSenderName(message.sender)}
          </span>
          <span className="message-time">
            {formatTimestamp(message.createdAt || Date.now())}
          </span>
          
          {/* Admin delete button */}
          {isAdmin && !isAnnouncement && (
            <button 
              className="delete-message-btn"
              onClick={handleDelete}
              title="Purge neural data"
            >
              🗑️
            </button>
          )}
        </div>
        
        <div className="message-bubble">
          {/* File content */}
          {renderFileContent()}
          
          {/* Text content */}
          {message.message && (
            <div className="message-text">
              <span className="message-prefix">
                {isAnnouncement ? '>> SYSTEM_BROADCAST: ' : '>> '}
              </span>
              <span className="message-body">
                {message.message}
              </span>
            </div>
          )}
        </div>
        
        {/* Message status indicators */}
        <div className="message-status">
          {isOwnMessage && (
            <span className="status-indicator sent">
              TRANSMITTED
            </span>
          )}
          {isAnnouncement && (
            <span className="status-indicator broadcast">
              BROADCAST
            </span>
          )}
          {message.edited && (
            <span className="status-indicator edited">
              MODIFIED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
