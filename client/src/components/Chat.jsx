// Frontend/src/components/Chat.jsx - Main chat component
import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import "../styles.css";

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
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem(isAdmin ? 'adminToken' : 'token'),
        isAdmin,
        userId: currentUser?._id
      }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('>> Neural network connection established');
    });

    newSocket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
      if (message.sender._id !== selectedUser?._id) {
        setNotifications(prev => ({
          ...prev,
          [message.sender._id]: (prev[message.sender._id] || 0) + 1
        }));
      }
    });

    newSocket.on('userOnline', (userId) => {
      setOnlineUsers(prev => [...prev, userId]);
    });

    newSocket.on('userOffline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    newSocket.on('announcement', (announcement) => {
      setMessages(prev => [...prev, {
        ...announcement,
        isAnnouncement: true
      }]);
    });

    newSocket.on('typing', (data) => {
      if (data.userId !== currentUser._id && data.conversationId === selectedUser?._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    newSocket.on('userKicked', ({ userId, reason }) => {
      if (userId === currentUser._id) {
        alert(`>> Neural link terminated. Reason: ${reason}`);
        window.location.reload();
      }
    });

    return () => newSocket.close();
  }, [currentUser, isAdmin, selectedUser]);

  // 📡 Fetch user list
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem(isAdmin ? 'adminToken' : 'token');
      const endpoint = isAdmin ? '/api/admin/chat/users' : '/api/user/chat/contacts';
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching neural contacts:', error);
    }
  }, [isAdmin]);

  // 📡 Fetch messages
  const fetchMessages = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem(isAdmin ? 'adminToken' : 'token');
      const response = await axios.get(`/api/chat/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      setNotifications(prev => ({
        ...prev,
        [userId]: 0
      }));
    } catch (error) {
      console.error('Error loading neural data:', error);
    }
  }, [isAdmin]);

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

    if (socket) {
      socket.emit('joinRoom', user._id);
    }
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
      await axios.post('/api/chat/send', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Error transmitting neural data:', error);
    }
  };

  // 📢 Handle announcement (admin only)
  const handleSendAnnouncement = async (message) => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/admin/chat/announcement', {
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error broadcasting system message:', error);
    }
  };

  // 🚫 Kick user (admin only)
  const handleKickUser = async (userId, reason = 'Violation of neural protocols') => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/admin/chat/kick', {
        userId,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error executing termination protocol:', error);
    }
  };

  // 🗑️ Delete message (admin only)
  const handleDeleteMessage = async (messageId) => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/chat/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error purging neural data:', error);
    }
  };

  // ⌨️ Typing indicator
  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        userId: currentUser._id,
        conversationId: selectedUser._id
      });
    }
  };

  return (
    <div className="chat-container">
      {/* Geometric Network Background */}
      <div className="particle-network">
        <div className="geometric-sphere">
          <div className="sphere-container">
            <div className="sphere-ring ring-1"></div>
            <div className="sphere-ring ring-2"></div>
            <div className="sphere-ring ring-3"></div>
            <div className="sphere-ring ring-4"></div>
            <div className="vertical-line v-line-1"></div>
            <div className="vertical-line v-line-2"></div>
            <div className="vertical-line v-line-3"></div>
            <div className="horizontal-line h-line-1"></div>
            <div className="horizontal-line h-line-2"></div>
            <div className="horizontal-line h-line-3"></div>
            <div className="node node-1"></div>
            <div className="node node-2"></div>
            <div className="node node-3"></div>
            <div className="node node-4"></div>
            <div className="node node-5"></div>
            <div className="node node-6"></div>
            <div className="connection-line conn-1"></div>
            <div className="connection-line conn-2"></div>
            <div className="connection-line conn-3"></div>
            <div className="connection-line conn-4"></div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="chat-interface">
        <div className="chat-header">
          <h2>{isAdmin ? 'ADMIN_NEURAL_CONTROL' : 'NEURAL_CHAT_INTERFACE'}</h2>
        </div>

        <div className="chat-body">
          {/* Users Sidebar */}
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h3>{isAdmin ? 'CONNECTED_USERS' : 'NEURAL_LINKS'}</h3>
              {isAdmin && (
                <div className="admin-controls">
                  <button 
                    className="announcement-btn"
                    onClick={() => setSelectedUser({ _id: 'all', name: 'BROADCAST_ALL' })}
                  >
                    📢 BROADCAST
                  </button>
                </div>
              )}
            </div>

            <div className="users-list">
              {!isAdmin && (
                <div 
                  className={`user-item priority-admin ${selectedUser?._id === 'admin' ? 'active' : ''}`}
                  onClick={() => handleUserSelect({ _id: 'admin', name: 'SYSTEM_ADMIN', isAdmin: true })}
                >
                  <div className="user-avatar admin-avatar">⚡</div>
                  <div className="user-info">
                    <div className="user-name">SYSTEM_ADMIN</div>
                    <div className="user-status">ALWAYS_ONLINE</div>
                  </div>
                  {notifications['admin'] > 0 && (
                    <div className="notification-badge">{notifications['admin']}</div>
                  )}
                </div>
              )}

              {users.map(user => (
                <div 
                  key={user._id}
                  className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name.toUpperCase().replace(' ', '_')}</div>
                    <div className="user-status">
                      {onlineUsers.includes(user._id) ? 'NEURAL_ACTIVE' : 'NEURAL_OFFLINE'}
                    </div>
                  </div>
                  
                  {notifications[user._id] > 0 && (
                    <div className="notification-badge">{notifications[user._id]}</div>
                  )}
                  
                  {isAdmin && (
                    <div className="admin-user-controls">
                      <button 
                        className="kick-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const reason = prompt('>> Enter termination protocol reason:', 'Violation of neural protocols');
                          if (reason) handleKickUser(user._id, reason);
                        }}
                      >
                        🚫
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Main Area */}
          <div className="chat-main">
            {selectedUser ? (
              <>
                <div className="chat-main-header">
                  <div className="chat-user-info">
                    <h3>{selectedUser.name}</h3>
                    {isAdmin && selectedUser._id !== 'all' && (
                      <div className="admin-chat-controls">
                        <button 
                          onClick={() => {
                            if (window.confirm('>> CONFIRM: Execute complete neural data purge?')) {
                              // Clear chat history logic here
                            }
                          }}
                        >
                          🗑️ PURGE_DATA
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Container */}
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
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                      <span>Processing neural data...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <ChatInput 
                  onSendMessage={selectedUser._id === 'all' ? handleSendAnnouncement : handleSendMessage}
                  onTyping={handleTyping}
                  isAdmin={isAdmin}
                  isBroadcast={selectedUser._id === 'all'}
                />
              </>
            ) : (
              <div className="no-chat-selected">
                <h3> SELECT_NEURAL_LINK_TO_INITIALIZE</h3>
                <p>Choose a connection from the neural network</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
