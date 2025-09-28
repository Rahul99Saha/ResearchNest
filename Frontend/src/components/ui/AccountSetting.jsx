// Frontend/components/ui/AccountSetting.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Card from './card.jsx';

const API_URL = "http://localhost:5001/api";

function AccountSettings({ onSuccessUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match.' });
    }
    if (formData.newPassword.length < 6) {
      return setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const updatePayload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const res = await axios.put(`${API_URL}/profile/change-password`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: res.data.message });
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
      setShowForm(false); // Hide the form on success
      onSuccessUpdate();

    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

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
      <button 
        onClick={() => setShowForm(!showForm)}
        style={{ padding: '8px 15px', cursor: 'pointer', minWidth: '100px' }}
      >
        {buttonText}
      </button>
    </div>
  );

  return (
    <Card 
      title="Account Settings" 
      subtitle="Manage your password"
    >
      <SettingItem 
        title="Change Password" 
        description="Update your account password" 
        buttonText={showForm ? "Cancel" : "Change"} 
      />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #eee', padding: '20px 0' }}>
          {message && (
            <p style={{ color: message.type === 'error' ? 'red' : 'green', marginBottom: '15px' }}>
              {message.text}
            </p>
          )}

          <input type="password" name="currentPassword" placeholder="Current Password" value={formData.currentPassword} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <input type="password" name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <input type="password" name="confirmNewPassword" placeholder="Confirm New Password" value={formData.confirmNewPassword} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }} />
          
          <button type="submit" disabled={loading} style={{ padding: '8px 20px', cursor: 'pointer' }}>
            {loading ? 'Submitting...' : 'Set New Password'}
          </button>
        </form>
      )}
    </Card>
  );
}

export default AccountSettings;