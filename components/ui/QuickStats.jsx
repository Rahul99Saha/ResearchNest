import React from 'react';
import Card from './card.jsx'; // Card is in the same 'ui' directory

// Component to render a single stat item
const StatItem = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
    <span style={{ color: '#666', fontSize: '0.95em' }}>{label}</span>
    <span style={{ fontWeight: 'bold', fontSize: '0.95em' }}>{value}</span>
  </div>
);

function QuickStats() {
  return (
    // We reuse the Card component to wrap the stats section
    <Card title="Quick Stats" style={{ padding: '20px 25px' }}>
      <div style={{ padding: '5px 0 10px 0' }}>
        <StatItem 
          label="Member since" 
          value="January 2024" 
        />
        <StatItem 
          label="Last login" 
          value="Today" 
        />
      </div>

      {/* Research progress bar and label */}
      <div style={{ marginTop: '15px' }}>
        <StatItem 
          label="Research progress" 
          value="45%" 
        />
        <div style={{ 
          height: '8px', 
          backgroundColor: '#eee', 
          borderRadius: '4px', 
          marginTop: '5px' 
        }}>
          <div style={{
            width: '45%', 
            height: '100%', 
            backgroundColor: '#007bff', // Example primary color
            borderRadius: '4px' 
          }} />
        </div>
      </div>
    </Card>
  );
}

export default QuickStats;