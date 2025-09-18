// Frontend/src/pages/ChatPage.jsx - Chat page wrapper
import React, { useState, useEffect } from "react";
import Chat from "../components/Chat";
import "../styles.css";

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeUser = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("token");

      if (adminToken) {
        const adminData = localStorage.getItem("user");
        if (adminData) {
          setCurrentUser(JSON.parse(adminData));
          setIsAdmin(true);
        } else {
          await fetchAdminData();
        }
      } else if (userToken) {
        await fetchUserData();
      } else {
        setError(
          "Neural link not authenticated. Please login to access the chat network."
        );
        redirectToLogin();
        return;
      }
    } catch (err) {
      console.error("Error initializing neural interface:", err);
      setError("Failed to establish neural connection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.admin);
        setIsAdmin(true);
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      localStorage.removeItem("adminToken");
      redirectToLogin();
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser({
          _id: data._id || "user_" + Date.now(),
          name: data.name,
          email: data.email,
          isAdmin: false,
        });
        setIsAdmin(false);
      } else {
        throw new Error("Invalid user credentials");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      localStorage.removeItem("token");
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  const handleChatClose = () => {
    if (isAdmin) {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/user";
    }
  };

  if (isLoading) {
    return (
      <div className="chat-loading">
        <div className="neural-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <div className="loading-text">
          <h3>Establishing Neural Connection...</h3>
          <p>Initializing quantum encryption protocols</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Neural Connection Failed</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button
              className="retry-btn"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                initializeUser();
              }}
            >
              Retry Connection
            </button>
            <button
              className="login-btn"
              onClick={() => (window.location.href = "/login")}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {currentUser && (
        <Chat
          currentUser={currentUser}
          isAdmin={isAdmin}
          onClose={handleChatClose}
        />
      )}
    </div>
  );
};

export default ChatPage;
