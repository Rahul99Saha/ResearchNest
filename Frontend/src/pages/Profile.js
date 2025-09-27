// Frontend/pages/Profile.jsx

import React from 'react';
import Card from '../components/ui/card.jsx'; // Assume a reusable Card component
import ProfileHeader from '../components/ui/ProfileHeader.jsx';
import PersonalInformation from '../components/ui/ProfileInformation.jsx';
import QuickStats from '../components/ui/QuickStats.jsx';
import AccountSettings from '../components/ui/AccountSetting.jsx';

function Profile() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Profile</h1>
      <p style={{ color: '#666' }}>
        Manage your account settings and personal information.
      </p>

      <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        
        {/* Left Column (Profile Header and Quick Stats) */}
        <div style={{ flex: '0 0 300px' }}>
          <ProfileHeader />
          <div style={{ marginTop: '20px' }}>
            <QuickStats />
          </div>
        </div>

        {/* Right Column (Information and Settings) */}
        <div style={{ flex: '1' }}>
          <PersonalInformation />
          <div style={{ marginTop: '30px' }}>
            <AccountSettings />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;