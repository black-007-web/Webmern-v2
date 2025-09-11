import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "particles.js";

//Hi Admin

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    window.particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#00ffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: { enable: true, color: "#00ffff", opacity: 0.4 },
        move: { enable: true, speed: 2 },
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
        },
      },
      retina_detect: true,
    });
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://api-fable-forest.onrender.com/api/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.admin));
      navigate("/admin");
    } catch (err) {
      alert("Login failed. Check email/password.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#000",
      fontFamily: "'Orbitron', sans-serif"
    }}>
      <div id="particles-js" style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0
      }}></div>

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px", // Adjust based on navbar height
        height: "100%"
      }}>
        <form onSubmit={handleAdminLogin} style={{
          width: "100%",
          maxWidth: "320px",
          padding: "24px",
          borderRadius: "10px",
          border: "2px solid #00ffff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          boxShadow: "0 0 15px #00ffff",
          backdropFilter: "blur(4px)",
          color: "#fff"
        }}>
          <h2 style={{
            fontSize: "24px",
            color: "#00ffff",
            marginBottom: "14px",
            textAlign: "center",
            textShadow: "0 0 6px #00ffff"
          }}>ADMIN LOGIN</h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#ccc" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                backgroundColor: "transparent",
                border: "1px solid #00ffff",
                borderRadius: "6px",
                color: "#fff",
                outline: "none",
                boxShadow: "0 0 6px #00ffff"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#ccc" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "13px",
                backgroundColor: "transparent",
                border: "1px solid #00ffff",
                borderRadius: "6px",
                color: "#fff",
                outline: "none",
                boxShadow: "0 0 6px #00ffff"
              }}
            />
          </div>

          <button type="submit" style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            backgroundColor: "transparent",
            border: "1px solid #00ffff",
            color: "#00ffff",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 0 8px #00ffff"
          }}>Login</button>

          <p style={{ marginTop: "12px", fontSize: "12px", color: "#ccc", textAlign: "center" }}>
            Not a user? <Link to="/login" style={{
              color: "#ff00ff",
              textDecoration: "none",
              fontWeight: "bold",
              textShadow: "0 0 5px #ff00ff"
            }}>User Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
