import React, { useState, useEffect } from "react";
import "./FacultyDashboard.css";
// Make sure you have this function in your api.js file
import { getFacultyStudents, overrideStudentNodeStatus } from "../../api.js";
import StudentProgressTree from "../Progress/StudentProgressTree.js";

const transformStudentData = (students) => {
  // ... this function remains the same as the previous response
  const formatLastActivity = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return "Over a week ago";
  };

  return students.map((student) => {
    let overallProgress = 0;
    let status = "On Track";
    if (student.progress && student.progress.milestones) {
      const allSubtasks = student.progress.milestones.flatMap((m) =>
        m.stages.flatMap((s) => s.tasks.flatMap((t) => t.subtasks))
      );
      const completedSubtasks = allSubtasks.filter(
        (st) => st.status === "Completed"
      ).length;
      overallProgress =
        allSubtasks.length > 0
          ? Math.round((completedSubtasks / allSubtasks.length) * 100)
          : 0;
      if (overallProgress >= 80) status = "Ahead";
      else if (overallProgress >= 50) status = "On Track";
      else if (overallProgress >= 25) status = "Behind";
      else status = "At Risk";
    }

    const lastAudit =
      student.progress?.audit?.[student.progress.audit.length - 1];

    return {
      id: student._id,
      name: student.name,
      program: student.program || "N/A",
      status: status,
      overallProgress: overallProgress,
      activeProjects: 1, // Placeholder
      lastActivity: formatLastActivity(lastAudit?.when),
      profilePic: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        student.name
      )}`,
      progress: student.progress,
    };
  });
};

const calculateFacultyMetrics = (students) => {
  const totalStudents = students.length;
  const onTrack = students.filter(
    (s) => s.status === "On Track" || s.status === "Ahead"
  ).length;
  const needAttention = students.filter(
    (s) => s.status === "At Risk" || s.status === "Behind"
  ).length;
  const totalProgress = students.reduce((sum, s) => sum + s.overallProgress, 0);
  const avgProgress =
    totalStudents > 0 ? (totalProgress / totalStudents).toFixed(1) : 0;
  return { totalStudents, onTrack, needAttention, avgProgress };
};

const renderStudentStatusBadge = (status) => {
  let className = "student-status-badge";
  if (status === "On Track") className += " on-track";
  else if (status === "At Risk") className += " at-risk";
  else if (status === "Ahead") className += " ahead";
  else if (status === "Behind") className += " behind";
  return <span className={className}>{status}</span>;
};

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Students");
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getFacultyStudents();
        const transformed = transformStudentData(response.data);
        setStudents(transformed);
      } catch (err) {
        setError("Failed to fetch student data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleProgress = (studentId) => {
    setExpandedStudentId((prevId) => (prevId === studentId ? null : studentId));
  };

  // --- NEW: Handler for the override API call ---
  const handleOverrideStatus = async (studentId, nodeId, newStatus) => {
    try {
      console.log(studentId);
      const response = await overrideStudentNodeStatus(
        studentId,
        nodeId,
        newStatus
      );

      // The backend should return the full, updated student progress instance.
      // We will use this to refresh the specific student's data in our state.
      const updatedProgressInstance = response.data;

      // Find the original student object to combine with the new progress
      const originalStudent = students.find((s) => s.id === studentId);
      if (!originalStudent) return; // Should not happen

      // We need to re-create the student object with the updated progress
      // and then re-run our transformation logic on it.
      const studentWithNewProgress = {
        ...originalStudent, // Keep original data like name, program etc.
        progress: updatedProgressInstance,
      };

      const transformed = transformStudentData([studentWithNewProgress])[0];

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? student : transformed
        )
      );

      alert("Student progress updated successfully!"); // Simple feedback
    } catch (err) {
      console.error("Failed to override status:", err);
      alert("Error: Could not update student progress.");
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading Faculty Dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const metrics = calculateFacultyMetrics(students);
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All Students" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="faculty-dashboard-container">
      <header className="faculty-header">
        <h1>Faculty Dashboard</h1>
        <p>
          Monitor student progress and provide guidance across all research
          projects.
        </p>
      </header>

      <section className="faculty-overview-cards">
        <div className="card">
          <div className="card-top-row">
            <p>Total Students</p>
            <span className="card-icon">👥</span>
          </div>
          <div className="large-number">{metrics.totalStudents}</div>
          <div className="card-info">Under supervision</div>
        </div>
        <div className="card">
          <div className="card-top-row">
            <p>On Track</p>
            <span className="card-icon">👍</span>
          </div>
          <div className="large-number">{metrics.onTrack}</div>
          <div className="card-info">Meeting expectations</div>
        </div>
        <div className="card">
          <div className="card-top-row">
            <p>Need Attention</p>
            <span className="card-icon">⚠️</span>
          </div>
          <div className="large-number">{metrics.needAttention}</div>
          <div className="card-info">Require support</div>
        </div>
        <div className="card">
          <div className="card-top-row">
            <p>Avg Progress</p>
            <span className="card-icon">📈</span>
          </div>
          <div className="large-number">{metrics.avgProgress}%</div>
          <div className="card-info">Across all students</div>
        </div>
      </section>

      <section className="student-overview-section">
        <div className="section-header">
          <h2>Student Overview</h2>
          <p>
            View and manage progress for all students under your supervision
          </p>
        </div>
        <div className="student-filters">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="status-dropdown"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All Students">All Students</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
            <option value="Ahead">Ahead</option>
            <option value="Behind">Behind</option>
          </select>
        </div>
        <div className="student-cards-grid">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`student-card ${
                  expandedStudentId === student.id ? "is-expanded" : ""
                }`}
              >
                <div className="student-card-header">
                  <img
                    src={student.profilePic}
                    alt={student.name}
                    className="profile-pic"
                  />
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <p>{student.program}</p>
                  </div>
                  {renderStudentStatusBadge(student.status)}
                </div>
                <div className="student-progress-section">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>Overall Progress</p>
                    <span className="progress-percentage">
                      {student.overallProgress}%
                    </span>
                  </div>
                  <div className="student-progress-bar-outer">
                    <div
                      className="student-progress-bar-inner"
                      style={{ width: `${student.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="student-details-row">
                  <div>
                    <p>Active Projects</p>
                    <span>{student.activeProjects}</span>
                  </div>
                  <div>
                    <p>Last Activity</p>
                    <span>{student.lastActivity}</span>
                  </div>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => handleToggleProgress(student.id)}
                >
                  {expandedStudentId === student.id
                    ? "Hide Progress"
                    : "View & Edit Progress"}
                </button>
                {expandedStudentId === student.id && (
                  <StudentProgressTree
                    studentId={student.id}
                    progress={student.progress}
                    onOverride={handleOverrideStatus}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="no-students-found">
              No students match your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FacultyDashboard;
