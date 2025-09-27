// Frontend/components/ui/AccountSettings.jsx

import React from 'react';
import Card from './card.jsx';

const SettingItem = ({ title, description, buttonText }) => (
  <div 
    style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '1px solid #eee', 
      padding: '15px 0' 
    }}
  >
    <div>
      <div style={{ fontWeight: 'bold' }}>{title}</div>
      <div style={{ color: '#888', fontSize: '0.9em' }}>{description}</div>
    </div>
    <button style={{ padding: '8px 15px', cursor: 'pointer', minWidth: '100px' }}>
      {buttonText}
    </button>
  </div>
);

function AccountSettings() {
  return (
    <Card 
      title="Account Settings" 
      subtitle="Manage your account preferences and security settings."
    >
      <SettingItem 
        title="Email Notifications" 
        description="Receive email updates about your research progress" 
        buttonText="Configure" 
      />
      <SettingItem 
        title="Change Password" 
        description="Update your account password" 
        buttonText="Change" 
      />
      <SettingItem 
        title="Two-Factor Authentication" 
        description="Add an extra layer of security to your account" 
        buttonText="Enable" 
      />
    </Card>
  );
}

export default AccountSettings;