import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

// Assuming AuthContext provides user info and token access
import { AuthContext } from "../contexts/AuthContext.js";

import ProfileHeader from "../components/ui/ProfileHeader.jsx";
import PersonalInformation from "../components/ui/ProfileInformation.jsx"; // Renamed from ProfileInformation
import QuickStats from "../components/ui/QuickStats.jsx";
import AccountSettings from "../components/ui/AccountSetting.jsx";

const API_URL = process.env.REACT_APP_API_URL; // Ensure this matches your server port

function Profile() {
  const { user } = useContext(AuthContext); // Get user for auth
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the profile data
  const fetchProfile = async () => {
    if (!user) return; // Wait for user context
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authorization token found.");

      const res = await axios.get(`${API_URL}/profile/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.data);
      setProfileData(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Failed to fetch profile:",
        err.response?.data?.message || err.message
      );
      setError(err.response?.data?.message || "Failed to load profile data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Handler passed to children to re-fetch data after a successful update
  const handleProfileUpdate = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading profile data...
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        Error: {error || "Profile data is missing."}
      </div>
    );
  }

  // Destructure for cleaner access
  const { role, researchProfile, memberSince, lastLogin, userId } = profileData;

  const isStudent = role === "Student";

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
          flexWrap: "wrap",
        }}
      >
        {/* Left Column (Profile Header and Quick Stats) */}
        <div style={{ flex: "1 1 300px", maxWidth: "350px" }}>
          {/* PASS DATA */}
          <ProfileHeader
            name={(user && user.name) || "Student"}
            email={(user && user.name) || "test@gmail.com"}
            role={role}
          />

          <div style={{ marginTop: "20px" }}>
            {/* PASS DATA */}
            <QuickStats
              memberSince={memberSince}
              lastLogin={lastLogin}
              role={role}
              researchProgress={researchProfile.researchProgress || 0} // Assuming this field exists
            />
          </div>
        </div>

        {/* Right Column (Information and Settings) */}
        <div style={{ flex: "2 1 600px", minWidth: "300px" }}>
          {/* PASS DATA AND HANDLER */}
          <PersonalInformation
            name={user.name}
            role={user.role}
            email={user.email}
            userID={user.id}
            onSuccessUpdate={handleProfileUpdate}
          />

          <div style={{ marginTop: "30px" }}>
            {/* PASS HANDLER */}
            <AccountSettings onSuccessUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
