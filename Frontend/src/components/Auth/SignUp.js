import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const roles = ["Student", "Faculty"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    window.alert("Passwords do not match. Please try again.");
    return;
  }

  try {
    await signup(formData); // Call backend
    window.alert("Sign Up successful!");
    navigate("/login");
  } catch (err) {
    // Map backend errors to friendly messages
    let message = "Sign Up failed. Please try again.";
    if (err.response && err.response.data && err.response.data.message) {
      if (err.response.data.message === "Email exists") {
        message = "This email is already registered.";
      } else if (err.response.data.message === "Server error") {
        message = "Something went wrong on the server. Please try later.";
      }
    }
    window.alert(message);
  }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.icon}>📖</div>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.subtitle}>
          Join ResearchNest to track your research progress
        </p>

        {/* Input fields using formData and handleChange */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email" // Changed from missing 'email' variable to formData.email
          placeholder="you@university.edu"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required // Added required
        />

        {/* Role Dropdown */}
        <div style={styles.selectWrapper}>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="" disabled hidden>
              Select Role
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <span style={styles.selectArrow}></span>
        </div>

        <input
          type="password"
          name="password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          minLength={6}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Create Account
        </button>

        <p style={styles.loginText}>
          Already have an account?
          <a href="/login" style={styles.loginLink}>
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

// --- START OF CORRECTED STYLES ---
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
    width: "360px",
    padding: "30px",
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
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
  },
  input: {
    width: "80%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  selectWrapper: {
    position: "relative",
    margin: "8px 0",
    width: "100%",
  },

  select: {
    width: "88%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
    appearance: "none",
    cursor: "pointer",
    paddingRight: "30px",
  },
  selectArrow: {
    position: "absolute",
    top: "50%",
    right: "35px",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    width: "0",
    height: "0",
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: "5px solid #666",
  },
  button: {
    width: "50%",
    padding: "14px",
    marginTop: "20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  loginText: {
    marginTop: "25px",
    fontSize: "14px",
    color: "#555",
  },
  loginLink: {
    color: "#1a1a1a",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "5px",
  },
};

export default Signup;
