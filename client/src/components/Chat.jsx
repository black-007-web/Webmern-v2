// Frontend/src/components/Chat.jsx - Main chat component
import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import "../styles.css";

const BACKEND_URL = "https://api-fable-forest.onrender.com"; // ✅ adjust if needed

const Chat = ({ currentUser, isAdmin = false }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  // 🔌 Establish socket connection
  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      auth: {
        token: localStorage.getItem(isAdmin ? 'adminToken' : 'token'),
        isAdmin,
        userId: currentUser?._id,
      },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket connected to backend');
    });

    newSocket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.sender._id !== selectedUser?._id) {
        setNotifications((prev) => ({
          ...prev,
          [message.sender._id]: (prev[message.sender._id] || 0) + 1,
        }));
      }
    });

    newSocket.on('userOnline', (userId) => {
      setOnlineUsers((prev) => [...prev, userId]);
    });

    newSocket.on('userOffline', (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    newSocket.on('announcement', (announcement) => {
      setMessages((prev) => [
        ...prev,
        { ...announcement, isAnnouncement: true },
      ]);
    });

    newSocket.on('typing', (data) => {
      if (
        data.userId !== currentUser._id &&
        data.conversationId === selectedUser?._id
      ) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    newSocket.on('userKicked', ({ userId, reason }) => {
      if (userId === currentUser._id) {
        alert(`❌ Disconnected by admin. Reason: ${reason}`);
        window.location.reload();
      }
    });

    return () => newSocket.close();
  }, [currentUser, isAdmin, selectedUser]);

  // 📡 Fetch user list
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem(isAdmin ? 'adminToken' : 'token');
      const endpoint = isAdmin
        ? `${BACKEND_URL}/api/chat/admin/users`
        : `${BACKEND_URL}/api/chat/user/contacts`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      console.error('❌ Error fetching contacts:', error);
    }
  }, [isAdmin]);

  // 📡 Fetch messages
  const fetchMessages = useCallback(
    async (userId) => {
      try {
        const token = localStorage.getItem(isAdmin ? 'adminToken' : 'token');
        const response = await axios.get(
          `${BACKEND_URL}/api/chat/messages/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages(response.data.messages || []);
        setNotifications((prev) => ({
          ...prev,
          [userId]: 0,
        }));

        if (socket) {
          socket.emit('joinRoom', response.data.conversationId);
        }
      } catch (error) {
        console.error('❌ Error loading messages:', error);
      }
    },
    [isAdmin, socket]
  );

  // 🔄 Initial load
  useEffect(() => {
    fetchUsers();
    if (!isAdmin) {
      setSelectedUser({ _id: 'admin', name: 'SYSTEM_ADMIN', isAdmin: true });
      fetchMessages('admin');
    }
  }, [fetchUsers, fetchMessages, isAdmin]);

  // 👤 Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  // ✉️ Handle sending messages
  const handleSendMessage = async (messageData) => {
    if (!selectedUser) return;

    try {
      const formData = new FormData();
      formData.append('receiverId', selectedUser._id);
      formData.append('message', messageData.message);
      formData.append('isAdmin', isAdmin);
      if (messageData.file) {
        formData.append('file', messageData.file);
      }

      const token = localStorage.getItem(isAdmin ? 'adminToken' : 'token');
      await axios.post(`${BACKEND_URL}/api/chat/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  // 📢 Handle announcement (admin only)
  const handleSendAnnouncement = async (message) => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${BACKEND_URL}/api/chat/admin/announcement`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('❌ Error sending announcement:', error);
    }
  };

  // 🚫 Kick user (admin only)
  const handleKickUser = async (userId, reason = 'Rule violation') => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${BACKEND_URL}/api/chat/admin/kick`,
        { userId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('❌ Error kicking user:', error);
    }
  };

  // 🗑️ Delete message (admin only)
  const handleDeleteMessage = async (messageId) => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${BACKEND_URL}/api/chat/admin/message/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error('❌ Error deleting message:', error);
    }
  };

  // ⌨️ Typing indicator
  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        userId: currentUser._id,
        conversationId: selectedUser._id,
      });
    }
  };

  return (
    <div className="chat-container">
      {/* Background */}
      <div className="particle-network">
        <div className="geometric-sphere">
          <div className="sphere-container">
            <div className="sphere-ring ring-1"></div>
            <div className="sphere-ring ring-2"></div>
            <div className="sphere-ring ring-3"></div>
            <div className="sphere-ring ring-4"></div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="chat-interface">
        <div className="chat-header">
          <h2>{isAdmin ? 'ADMIN CONTROL PANEL' : 'CHAT INTERFACE'}</h2>
        </div>

        <div className="chat-body">
          {/* Sidebar */}
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h3>{isAdmin ? 'Users' : 'Contacts'}</h3>
              {isAdmin && (
                <button
                  className="announcement-btn"
                  onClick={() =>
                    setSelectedUser({ _id: 'all', name: 'BROADCAST_ALL' })
                  }
                >
                  📢 Broadcast
                </button>
              )}
            </div>

            <div className="users-list">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user-item ${
                    selectedUser?._id === user._id ? 'active' : ''
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-status">
                      {onlineUsers.includes(user._id)
                        ? 'Online'
                        : 'Offline'}
                    </div>
                  </div>
                  {notifications[user._id] > 0 && (
                    <div className="notification-badge">
                      {notifications[user._id]}
                    </div>
                  )}
                  {isAdmin && (
                    <button
                      className="kick-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const reason = prompt(
                          'Kick reason:',
                          'Rule violation'
                        );
                        if (reason) handleKickUser(user._id, reason);
                      }}
                    >
                      🚫
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat */}
          <div className="chat-main">
            {selectedUser ? (
              <>
                <div className="chat-main-header">
                  <h3>{selectedUser.name}</h3>
                </div>
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message}
                      currentUser={currentUser}
                      isAdmin={isAdmin}
                      onDelete={handleDeleteMessage}
                    />
                  ))}
                  {isTyping && (
                    <div className="typing-indicator">Typing...</div>
                  )}
                </div>
                <ChatInput
                  onSendMessage={
                    selectedUser._id === 'all'
                      ? handleSendAnnouncement
                      : handleSendMessage
                  }
                  onTyping={handleTyping}
                  isAdmin={isAdmin}
                  isBroadcast={selectedUser._id === 'all'}
                />
              </>
            ) : (
              <div className="no-chat-selected">
                <h3>Select a user to start chatting</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
