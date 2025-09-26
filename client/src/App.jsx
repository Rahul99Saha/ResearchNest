import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/SignUp.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';

function App() {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={role==='student' ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/faculty-dashboard" element={role==='faculty'||role==='admin' ? <FacultyDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
