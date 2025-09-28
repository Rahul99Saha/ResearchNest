// Frontend/components/ui/ResearchInformation.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './card'; 

const API_URL = "http://localhost:5001/api"; 

// Reusable Input Field component for display/editing
const InfoField = ({ label, value, name, onChange, disabled }) => (
  <div style={{ flex: 1, minWidth: '200px' }}>
    <label style={{ fontSize: '0.9em', color: '#666', display: 'block', marginBottom: '5px' }}>
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ padding: '10px', backgroundColor: disabled ? '#f9f9f9' : 'white', borderRadius: '4px', border: '1px solid #eee', width: '100%', boxSizing: 'border-box' }}
    />
  </div>
);

function ResearchInformation({ researchProfile, academicInfo, isStudent, onSuccessUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    // Research Fields
    researchTopic: researchProfile.researchTopic || '',
    researchArea: researchProfile.researchArea || '',
    
    // Academic/Faculty Fields
    program: isStudent ? (academicInfo.program || '') : '',
    designation: !isStudent ? (academicInfo.designation || '') : '',
    startDate: researchProfile.startDate || '',
    expectedCompletion: researchProfile.expectedCompletion || '',
  });

  useEffect(() => {
    // Sync local state when props change
    setFormData({
      researchTopic: researchProfile.researchTopic || '',
      researchArea: researchProfile.researchArea || '',
      program: isStudent ? (academicInfo.program || '') : '',
      designation: !isStudent ? (academicInfo.designation || '') : '',
      startDate: researchProfile.startDate || '',
      expectedCompletion: researchProfile.expectedCompletion || '',
    });
  }, [researchProfile, academicInfo, isStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // 1. Update Research Info (covers topic, start date, completion date)
      const researchPayload = {
        researchTopic: formData.researchTopic,
        researchArea: formData.researchArea,
        startDate: formData.startDate,
        expectedCompletion: formData.expectedCompletion,
      };
      await axios.put(`${API_URL}/profile/research-info`, researchPayload, { headers });

      // 2. Update Role-Specific Info
      if (isStudent) {
        const academicPayload = { program: formData.program }; // Assuming program is the main field here
        await axios.put(`${API_URL}/profile/academic-info`, academicPayload, { headers });
      } else {
        const facultyPayload = { designation: formData.designation };
        await axios.put(`${API_URL}/profile/faculty-info`, facultyPayload, { headers });
      }
      
      setMessage({ type: 'success', text: 'Research information updated successfully.' });
      setIsEditing(false);
      onSuccessUpdate(); // Trigger parent refresh

    } catch (err) {
      console.error('Update failed:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update research information.' });
    } finally {
      setLoading(false);
    }
  };

  // Determine the faculty/supervisor name
  const supervisorName = researchProfile.supervisor?.personalInfo 
    ? `${researchProfile.supervisor.personalInfo.firstName} ${researchProfile.supervisor.personalInfo.lastName}` 
    : 'Not Assigned';

  return (
    <Card 
      title="Research Information" 
      subtitle="Your current research project details and supervision."
    >
      <div style={{ padding: '20px' }}>
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            marginBottom: "15px" 
          }}
        >
          {message && (
            <span style={{ 
              color: message.type === 'error' ? 'red' : 'green', 
              marginRight: 'auto',
              alignSelf: 'center'
            }}>
              {message.text}
            </span>
          )}
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            style={{ 
              padding: '8px 15px', 
              cursor: 'pointer', 
              minWidth: '100px' 
            }}
          >
            {loading ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
          </button>
        </div>

        {/* First row of information */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <InfoField 
            label="Research Topic" 
            name="researchTopic"
            value={formData.researchTopic}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {/* Faculty/Supervisor is read-only (managed by admin/system) */}
          <InfoField 
            label="Faculty / Supervisor" 
            value={supervisorName} 
            disabled={true} 
          />
        </div>
        
        {/* Second row of information */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <InfoField 
            label="Start Date" 
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <InfoField 
            label="Expected Completion" 
            name="expectedCompletion"
            value={formData.expectedCompletion}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Third Row: Role Specific and Progress */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Role-Specific Field: Program (Student) or Designation (Faculty) */}
          <InfoField 
            label={isStudent ? 'Program' : 'Designation'}
            name={isStudent ? 'program' : 'designation'}
            value={isStudent ? formData.program : formData.designation}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {/* Research Progress (Read-Only) */}
          <InfoField 
            label="Research Progress" 
            value={`${researchProfile.researchProgress || 0}%`} 
            disabled={true} 
          />
        </div>
      </div>
    </Card>
  );
}

export default ResearchInformation;