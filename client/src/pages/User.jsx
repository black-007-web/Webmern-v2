// Frontend/components/User.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "particles.js";

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = 'https://api-fable-forest.onrender.com';

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please login.');
        window.location.href = '/login';
        return;
      }

      const res = await axios.get(`${BACKEND_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setLoading(false);
    } catch (err) {
      alert('Session expired or unauthorized. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/user/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      alert('Failed to remove book.');
    }
  };

  const handleReadBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/read/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.pdfUrl) {
        const fullPdfUrl = `${BACKEND_URL}${res.data.pdfUrl}`;
        window.open(fullPdfUrl, '_blank');
      } else {
        alert('PDF not available for this book.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot read this book.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const particlesElement = document.getElementById("particles-js");
      if (particlesElement) {
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 70, density: { enable: true, value_area: 800 } },
            color: { value: "#00ffff" },
            shape: { type: "circle" },
            opacity: { value: 0.6 },
            size: { value: 3 },
            line_linked: { enable: true, color: "#00ffff", opacity: 0.3 },
            move: { enable: true, speed: 2 }
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" }
            }
          },
          retina_detect: true
        });
        clearInterval(interval);
      }
    }, 100);

    fetchProfile();
  }, []);

  if (loading) return <div style={{ color: "#00ffff", textAlign: "center", marginTop: "20vh" }}>Loading user info…</div>;

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      minHeight: "100vh",
      backgroundColor: "#000",
      fontFamily: "'Orbitron', sans-serif",
      padding: "40px 20px"
    }}>
      <div id="particles-js" style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 0
      }}></div>

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        border: "2px solid #00ffff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 0 20px #00ffff",
        backdropFilter: "blur(4px)"
      }}>
        <section style={{ marginBottom: "30px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#fff" }}>👤 {user.name}</h2>
          <p style={{ fontSize: "16px", color: "#ccc" }}><strong>Email:</strong> {user.email}</p>
        </section>

        <section>
          <h3 style={{ fontSize: "22px", color: "#00ffff", marginBottom: "20px" }}>📚 Purchased Books</h3>
          {user.purchasedBooks.length === 0 ? (
            <p style={{ color: "#ccc" }}>No books purchased yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {user.purchasedBooks.map((book) => (
                <div key={book._id} style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid #00ffff",
                  borderRadius: "10px",
                  padding: "16px",
                  boxShadow: "0 0 10px #00ffff"
                }}>
                  <h4 style={{ fontSize: "18px", color: "#00ffff", marginBottom: "8px" }}>{book.title}</h4>
                  <p style={{ fontSize: "14px", color: "#ccc" }}><strong>Genre:</strong> {book.genre}</p>
                  <p style={{ fontSize: "14px", color: "#ccc" }}><strong>Author:</strong> {book.author}</p>
                  <p style={{ fontSize: "14px", color: "#ccc" }}><strong>Price:</strong> ${book.price}</p>
                  <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                    <button onClick={() => handleRemoveBook(book._id)} style={btnStyle}>❌ Remove</button>
                    <button onClick={() => handleReadBook(book._id)} style={btnStyle}>📖 Read</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: "6px 12px",
  fontSize: "13px",
  backgroundColor: "transparent",
  border: "1px solid #00ffff",
  color: "#00ffff",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "0 0 6px #00ffff",
  fontWeight: "bold"
};

export default User;
