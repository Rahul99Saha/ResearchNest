import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      window.alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      let message = "Login failed. Please try again.";

      if (err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        if (backendMessage === "Invalid credentials") {
          message = "Incorrect email or password.";
        } else if (backendMessage === "Server error") {
          message = "Server error. Please try again later.";
        }
      }

      window.alert(message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={submit} style={styles.card}>
        <div style={styles.icon}>📖</div>
        <h2 style={styles.title}>ResearchNest</h2>
        <p style={styles.subtitle}>Enter your email and password</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Sign In
        </button>

        <p style={styles.signupText}>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px", // responsive width
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  title: {
    margin: "10px 0",
    fontWeight: "bold",
    fontSize: "22px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#7d7d7d",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#111827",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  signupText: {
    marginTop: "15px",
    fontSize: "14px",
  },
};

// ✅ Extra: add global CSS for mobile adjustments
const responsiveCSS = `
@media (max-width: 480px) {
  h2 { font-size: 18px !important; }
  input { font-size: 13px !important; }
  button { font-size: 14px !important; }
}
`;

// inject styles dynamically
const styleTag = document.createElement("style");
styleTag.innerHTML = responsiveCSS;
document.head.appendChild(styleTag);
