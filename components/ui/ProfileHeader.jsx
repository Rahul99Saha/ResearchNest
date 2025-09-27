// Frontend/components/ui/ProfileHeader.jsx

import React from 'react';
import Card from './card.jsx';

function ProfileHeader() {
  return (
    <Card style={{ textAlign: 'center' }}>
      <div 
        style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: '#ccc', color: 'white', fontSize: '2em',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 10px auto'
        }}
      >
        JD
      </div>
      <div style={{ fontWeight: 'bold' }}>John Doe</div>
      <div style={{ color: '#666', fontSize: '0.9em' }}>student@test.com</div>
      <div 
        style={{
          backgroundColor: '#333', color: 'white', 
          padding: '2px 8px', borderRadius: '4px', 
          fontSize: '0.8em', display: 'inline-block',
          marginTop: '10px'
        }}
      >
        Student
      </div>
    </Card>
  );
}

export default ProfileHeader;