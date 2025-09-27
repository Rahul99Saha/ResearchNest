// Frontend/components/ui/PersonalInformation.jsx

import React from 'react';
import Card from './card.jsx';

// Reusable Input Field component for display
const InfoField = ({ label, value }) => (
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.9em', color: '#666', display: 'block', marginBottom: '5px' }}>
      {label}
    </label>
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
      {value}
    </div>
  </div>
);

function PersonalInformation() {
  return (
    <Card 
      title="Personal Information" 
      subtitle="Update your personal details and contact information."
    >
      {/* <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button style={{ padding: '5px 10px', cursor: 'pointer' }}>
          ✏️ Edit
        </button>
      </div> */}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
        <InfoField label="Full Name" value="👤 John Doe" />
        <InfoField label="Email Address" value="student@test.com" />
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <InfoField label="Role" value="⚪ Student" />
        <InfoField label="User ID" value="1" />
      </div>
    </Card>
  );
}

export default PersonalInformation;