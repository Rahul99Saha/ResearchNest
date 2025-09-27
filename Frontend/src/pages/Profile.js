// // Frontend/pages/Profile.jsx

import React from "react";
import Card from "../components/ui/card.jsx"; 
import ProfileHeader from "../components/ui/ProfileHeader.jsx";
import PersonalInformation from "../components/ui/ProfileInformation.jsx";
import QuickStats from "../components/ui/QuickStats.jsx";
import AccountSettings from "../components/ui/AccountSetting.jsx";
import ResearchInformation from "../components/ui/ResearchInformation.jsx";

function Profile() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>Profile</h1>
      <p style={{ color: "#666", fontSize: "1rem" }}>
        Manage your account settings and personal information.
      </p>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "30px",
          flexWrap: "wrap", // allows stacking on smaller screens
        }}
      >
        {/* Left Column (Profile Header and Quick Stats) */}
        <div
          style={{
            flex: "1 1 300px", // grow, shrink, min width 300px
            maxWidth: "350px",
          }}
        >
          <ProfileHeader />
          <div style={{ marginTop: "20px" }}>
            <QuickStats />
          </div>
        </div>

        {/* Right Column (Information and Settings) */}
        <div
          style={{
            flex: "2 1 600px", // take more space but shrink if needed
            minWidth: "300px",
          }}
        >
          <PersonalInformation />

          <div style={{ marginTop: "30px" }}>
            <AccountSettings />
          </div>

          <div style={{ marginTop: "30px" }}>
            <ResearchInformation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

