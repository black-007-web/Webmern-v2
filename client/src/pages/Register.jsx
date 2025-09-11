import React, { useState, useEffect } from "react";
import "particles.js";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accessCode: ""
  });
  const [error, setError] = useState("");
  const ADMIN_CODE = "123456";

  useEffect(() => {
    // Reset default browser spacing
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    const interval = setInterval(() => {
      if (document.getElementById("particles-js")) {
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 600 } },
            color: { value: "#00ffff" },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: 2 },
            line_linked: { enable: true, color: "#00ffff", opacity: 0.3 },
            move: { enable: true, speed: 1.5 },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
            },
          },
          retina_detect: true,
        });
        clearInterval(interval);
      }
    }, 100);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, accessCode } = form;

    if (!name || !email || !password || !accessCode) {
      setError("❌ All fields required.");
      return;
    }

    if (accessCode !== ADMIN_CODE) {
      setError("❌ Invalid access code.");
      return;
    }

    try {
      const res = await axios.post("https://api-fable-forest.onrender.com/api/auth/register", {
        name,
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/user";
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#000",
      fontFamily: "'Orbitron', sans-serif",
      overflow: "hidden",
      margin: 0,
      padding: 0
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
        <form onSubmit={handleRegister} style={{
          width: "100%",
          maxWidth: "280px",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #00ffff",
          backgroundColor: "rgba(0,0,0,0.5)",
          boxShadow: "0 0 10px #00ffff",
          backdropFilter: "blur(3px)",
          color: "#fff"
        }}>
          <h2 style={{
            fontSize: "20px",
            color: "#00ffff",
            textAlign: "center",
            marginBottom: "10px",
            textShadow: "0 0 6px #00ffff"
          }}>REGISTER</h2>

          {["name", "email", "password", "accessCode"].map((field) => (
            <div key={field} style={{ marginBottom: "12px" }}>
              <label style={{
                fontSize: "12px",
                color: "#ccc",
                marginBottom: "4px",
                display: "block"
              }}>
                {field === "name" ? "Name" :
                 field === "email" ? "Email" :
                 field === "password" ? "Password" : "Access Code"}
              </label>
              <input
                type={field === "password" || field === "accessCode" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  fontSize: "12px",
                  backgroundColor: "transparent",
                  border: "1px solid #00ffff",
                  borderRadius: "5px",
                  color: "#fff",
                  outline: "none",
                  boxShadow: "0 0 4px #00ffff"
                }}
              />
            </div>
          ))}

          {error && (
            <div style={{
              marginBottom: "10px",
              color: "#ff0066",
              fontSize: "12px",
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "0 0 3px #ff0066"
            }}>{error}</div>
          )}

          <button type="submit" style={{
            width: "100%",
            padding: "8px",
            fontSize: "13px",
            backgroundColor: "transparent",
            border: "1px solid #00ffff",
            color: "#00ffff",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 0 6px #00ffff"
          }}>Sign Up</button>

          <p style={{
            marginTop: "10px",
            fontSize: "11px",
            color: "#ccc",
            textAlign: "center"
          }}>
            Already registered? <a href="/login" style={{
              color: "#ff00ff",
              textDecoration: "none",
              fontWeight: "bold",
              textShadow: "0 0 4px #ff00ff"
            }}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
