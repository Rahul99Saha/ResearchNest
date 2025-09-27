import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext.js";
import Login from "./components/Auth/Login.js";
import SignUp from "./components/Auth/SignUp.js";
import StudentDashboard from "./components/Dashboard/StudentDashboard.js";
import Navbar from "./components/Navbar.js";   // ✅ Import Navbar
import Profile from "./pages/Profile.js"; // ✅ Import Profile

function Protected({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ✅ Navbar outside Routes so it’s always visible */}
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <StudentDashboard />
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <div style={{ padding: "20px" }}>
                  <Profile />
                </div>
              </Protected>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
