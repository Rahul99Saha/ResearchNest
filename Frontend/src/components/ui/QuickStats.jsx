import React from "react";
import Card from "./card.jsx"; // Card is in the same 'ui' directory

// Component to render a single stat item
const StatItem = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "5px 0",
    }}
  >
    <span style={{ color: "#666", fontSize: "0.95em" }}>{label}</span>
    <span style={{ fontWeight: "bold", fontSize: "0.95em" }}>{value}</span>
  </div>
);

function QuickStats({ lastLogin, memberSince, researchProgress, role }) {
  return (
    // We reuse the Card component to wrap the stats section
    <Card title="Quick Stats" style={{ padding: "20px 25px" }}>
      <div style={{ padding: "5px 0 10px 0" }}>
        <StatItem label="Member since" value={memberSince} />
        <StatItem label="Last login" value={lastLogin} />
      </div>
    </Card>
  );
}

export default QuickStats;
