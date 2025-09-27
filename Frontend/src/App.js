import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.js';
import Login from './components/Auth/Login.js';
import SignUp from './components/Auth/SignUp.js';
import StudentDashboard from './components/Dashboard/StudentDashboard.js';

function Protected({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}