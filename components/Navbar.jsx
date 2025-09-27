// Frontend/components/Navbar.jsx

import React from 'react';

function Navbar() {
  return (
    <nav 
      style={{ 
        backgroundColor: '#f8f8f8', 
        padding: '15px 20px', 
        borderBottom: '1px solid #eee' 
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
        App Name
      </div>
      {/* Add links or user info here */}
    </nav>
  );
}

export default Navbar;