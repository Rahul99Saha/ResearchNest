// Frontend/components/ui/PersonalInformation.jsx

import React from "react";
import Card from "./card.jsx";

// Reusable Input Field component for display
const InfoField = ({ label, value }) => (
  <div style={{ flex: 1 }}>
    <label
      style={{
        fontSize: "0.9em",
        color: "#666",
        display: "block",
        marginBottom: "5px",
      }}
    >
      {label}
    </label>
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "4px",
        border: "1px solid #eee",
      }}
    >
      {value}
    </div>
  </div>
);

function PersonalInformation({ personalInfo, name, email, role, userID }) {
  console.log(personalInfo);
  return (
    <Card
      title="Personal Information"
      subtitle="Update your personal details and contact information."
    >
      {/* Top bar with title + Edit button aligned like AccountSettings */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      ></div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
        <InfoField label="Full Name" value={`👤${name}`} />
        <InfoField label="Email Address" value={email} />
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <InfoField label="Role" value={`⚪ ${role}`} />
        <InfoField label="User ID" value={userID} />
      </div>
    </Card>
  );
}

export default PersonalInformation;
