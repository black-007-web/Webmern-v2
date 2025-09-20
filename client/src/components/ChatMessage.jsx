import React from "react";
import "../styles.css";

const ChatMessage = ({ message, currentUser, isAdmin = false, onDelete }) => {
  // ✅ Don't hide deleted messages completely (optional)
  if (!message) return null;

  const isOwnMessage = message?.sender?._id === currentUser?._id;
  const isSystemAdmin = message?.sender?.isAdmin;
  const isAnnouncement = message?.isAnnouncement;

  const handleDelete = () => {
    if (window.confirm(">> CONFIRM: Purge this neural data?")) {
      onDelete(message._id);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatSenderName = (sender) => {
    if (!sender) return "UNKNOWN_USER";
    if (sender.isAdmin) return "SYSTEM_ADMIN";
    return sender.name?.toUpperCase().replace(/\s+/g, "_") || "UNKNOWN_USER";
  };

  const renderFileContent = () => {
    if (!message.fileUrl) return null;
    const fileUrl = `https://api-fable-forest.onrender.com${message.fileUrl}`;

    if (message.fileType?.startsWith("image/")) {
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
              {message.fileName || "NEURAL_FILE_DATA"}
            </span>
          </a>
        </div>
      );
    }
  };

  return (
    <div
      className={`message 
        ${isOwnMessage ? "own" : ""} 
        ${isAnnouncement ? "announcement" : ""} 
        ${isSystemAdmin ? "system-message" : ""}`}
    >
      <div className="message-avatar">
        {isSystemAdmin
          ? "⚡"
          : message?.sender?.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      <div className="message-content">
        <div className="message-header">
          <span
            className={`sender-name ${
              isSystemAdmin ? "system-sender" : ""
            }`}
          >
            {formatSenderName(message.sender)}
          </span>
          <span className="message-time">
            {formatTimestamp(message.createdAt)}
          </span>
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
          {renderFileContent()}
          {message.message && (
            <div className="message-text">
              <span className="message-prefix">
                {isAnnouncement ? ">> SYSTEM_BROADCAST: " : ">> "}
              </span>
              <span className="message-body">{message.message}</span>
            </div>
          )}
        </div>

        <div className="message-status">
          {isOwnMessage && (
            <span className="status-indicator sent">TRANSMITTED</span>
          )}
          {isAnnouncement && (
            <span className="status-indicator broadcast">BROADCAST</span>
          )}
          {message.edited && (
            <span className="status-indicator edited">MODIFIED</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

