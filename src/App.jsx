// Frontend/src/App.jsx

import React from 'react';
import Navbar from './components/Navbar.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <>
      {/* Assuming Navbar is always visible */}
      <Navbar /> 
      {/* The main content area */}
      <div style={{ padding: '20px' }}> 
        <Profile />
      </div>
    </>
  );
}

export default App;