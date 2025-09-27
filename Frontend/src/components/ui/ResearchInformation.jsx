// Frontend/components/ui/ResearchInformation.jsx

import React from 'react';
import Card from './card'; 

// Reusable Input Field component for display (can be copied from PersonalInformation.jsx or defined here)
const InfoField = ({ label, value }) => (
  <div style={{ flex: 1, minWidth: '200px' }}>
    <label style={{ fontSize: '0.9em', color: '#666', display: 'block', marginBottom: '5px' }}>
      {label}
    </label>
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
      {value}
    </div>
  </div>
);

function ResearchInformation() {
  return (
    <Card 
      title="Research Information" 
      subtitle="Your current research project details and supervision."
    >
      {/* First row of information */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
        <InfoField 
          label="Research Topic" 
          value="Machine Learning Applications in Healthcare" 
        />
        <InfoField 
          label="Supervisor" 
          value="Dr. Smith" 
        />
      </div>
      
      {/* Second row of information */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <InfoField 
          label="Start Date" 
          value="January 1, 2024" 
        />
        <InfoField 
          label="Expected Completion" 
          value="December 31, 2024" 
        />
      </div>
    </Card>
  );
}

export default ResearchInformation;