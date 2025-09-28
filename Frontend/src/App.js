import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext.js";
import Login from "./components/Auth/Login.js";
import SignUp from "./components/Auth/SignUp.js";
import StudentDashboard from "./components/Dashboard/StudentDashboard.js";
import FacultyDashboard from "./components/Dashboard/FacultyDashboard.js";
import Navbar from "./components/Navbar.js";
import Profile from "./pages/Profile.js";

function Protected({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function DashboardRoute() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  return user.role.toLowerCase() === "student" ? (
    <StudentDashboard />
  ) : (
    <FacultyDashboard />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardRoute />
              </Protected>
            }
          />

          {/* Protected profile */}
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
