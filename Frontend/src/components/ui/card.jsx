// Frontend/components/ui/Card.jsx

import React from 'react';

function Card({ children, title, subtitle, style }) {
  return (
    <div 
      style={{
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        backgroundColor: 'white',
        ...style
      }}
    >
      {title && <h2 style={{ fontSize: '1.2em', margin: '0 0 5px 0' }}>{title}</h2>}
      {subtitle && <p style={{ color: '#666', fontSize: '0.9em', margin: '0 0 15px 0' }}>{subtitle}</p>}
      {children}
    </div>
  );
}

export default Card;