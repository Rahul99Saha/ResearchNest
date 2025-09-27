import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.js"; // adjust path if needed

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Hide Navbar on login & signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const buttonStyle = {
    padding: "6px 12px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "#fff",
    textDecoration: "none",
    color: "#000",
    fontSize: "0.95rem",
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    background: "#e53935", // red background
    color: "#fff",
    border: "none",
  };

  return (
    <nav
      style={{
        backgroundColor: "#f8f8f8",
        padding: "15px 20px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left Logo */}
      <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
        📖 ResearchNest
      </div>

      {/* Right Links (only if logged in) */}
      {user && (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/dashboard" style={buttonStyle}>
            Dashboard
          </Link>
          <Link to="/profile" style={buttonStyle}>
            👤 {user.name || "Profile"}
          </Link>
          <button onClick={logout} style={logoutButtonStyle}>
            ⎋ Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
