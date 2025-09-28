import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";
// --- NEW: Import the API service ---
import { getMyProgress, updateNodeStatus } from "../../api.js";

// --- NEW: Data Transformation Helper ---
// This function adapts the complex backend data structure to the simpler one
// the original frontend component was designed for (Milestone -> Task list).
const transformBackendData = (backendData) => {
  if (!backendData || !backendData.milestones) {
    return { studentName: "Student", milestones: [] };
  }

  // NOTE: Assuming student name would come from a user context or another API call.
  // Using a placeholder for now.
  var user = localStorage.getItem("user");
  if (user) user = JSON.parse(user);

  console.log(user);
  var studentName = "Student";

  if (user) studentName = user.name;

  const transformedMilestones = backendData.milestones.map((milestone) => {
    let tasks = [];
    // We flatten the Stage -> Task -> Subtask structure into a single list of tasks for the UI
    milestone.stages.forEach((stage) => {
      stage.tasks.forEach((task) => {
        task.subtasks.forEach((subtask) => {
          tasks.push({
            id: subtask._id, // Use the backend's _id
            title: subtask.title,
            isCompleted: subtask.status === "Completed",
          });
        });
      });
    });

    return {
      id: milestone._id,
      title: milestone.title,
      isExpanded: false, // Default to collapsed
      tasks: tasks,
    };
  });

  // Set the first milestone with 'In Progress' status to be expanded by default
  const firstInProgressIndex = backendData.milestones.findIndex(
    (m) => m.status === "In Progress"
  );
  if (firstInProgressIndex !== -1) {
    transformedMilestones[firstInProgressIndex].isExpanded = true;
  } else if (transformedMilestones.length > 0) {
    transformedMilestones[0].isExpanded = true; // Fallback to first item
  }

  return { studentName, milestones: transformedMilestones };
};

// --- HELPER FUNCTIONS (calculateMilestoneProgress remains mostly the same) ---
const calculateMilestoneProgress = (milestones) => {
  let totalTasks = 0;
  let completedTasks = 0;
  let activeMilestones = 0;
  let completedMilestones = 0;

  const processedMilestones = milestones.map((milestone) => {
    const total = milestone.tasks.length;
    const completed = milestone.tasks.filter((t) => t.isCompleted).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    const status =
      progress === 100
        ? "Completed"
        : progress > 0
        ? "In Progress"
        : "Not Started";

    totalTasks += total;
    completedTasks += completed;
    if (status === "Completed") completedMilestones++;
    if (status === "In Progress") activeMilestones++;

    return {
      ...milestone,
      progress,
      status,
      completedCount: completed,
      totalCount: total,
    };
  });

  const overallProgress =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    processedMilestones,
    metrics: {
      overallProgressPercent: overallProgress.toFixed(1),
      overallCompletedItems: completedTasks,
      overallTotalItems: totalTasks,
      activeMilestonesCount: activeMilestones,
      completedMilestonesCount: completedMilestones,
      weeklyTasksCount: 3, // Hardcoded for this demo
    },
  };
};

// --- REACT COMPONENT ---
const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MODIFIED: useEffect to fetch real data ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getMyProgress(); // API call
        const transformedData = transformBackendData(response.data);
        const { processedMilestones, metrics } = calculateMilestoneProgress(
          transformedData.milestones
        );

        setData({
          studentName: transformedData.studentName,
          milestones: processedMilestones,
          metrics,
        });
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- MODIFIED: Handler now calls the API ---
  const handleTaskToggle = async (milestoneId, taskId) => {
    if (!data) return;

    // Find the current status to determine the new status
    let currentTask;
    for (const m of data.milestones) {
      if (m.id === milestoneId) {
        currentTask = m.tasks.find((t) => t.id === taskId);
        break;
      }
    }
    if (!currentTask) return;

    const newStatus = currentTask.isCompleted ? "In Progress" : "Completed";

    try {
      // Call the API to update the backend
      const response = await updateNodeStatus(taskId, newStatus);

      // Re-process the fresh data from the server to update the UI
      const transformedData = transformBackendData(response.data);
      const { processedMilestones, metrics } = calculateMilestoneProgress(
        transformedData.milestones
      );

      setData((prevData) => ({
        ...prevData,
        milestones: processedMilestones,
        metrics,
      }));
    } catch (err) {
      console.error("Failed to update task:", err);
      // Optionally, show an error message to the user
      alert(
        "Could not update the task. Please check your connection and try again."
      );
    }
  };

  // --- UNCHANGED: This handler only manages local UI state ---
  const toggleMilestone = (milestoneId) => {
    if (!data) return;
    const updatedMilestones = data.milestones.map((m) =>
      m.id === milestoneId ? { ...m, isExpanded: !m.isExpanded } : m
    );
    setData((prevData) => ({ ...prevData, milestones: updatedMilestones }));
  };

  const renderStatusBadge = (status) => {
    let className = "status-badge";
    let icon = "";

    if (status === "Completed") {
      className += " completed";
      icon = "✔";
    } else if (status === "In Progress") {
      className += " in-progress";
      icon = "◷";
    } else {
      className += " not-started";
      icon = "◯";
    }

    return (
      <div className={className}>
        {icon}
        {status}
      </div>
    );
  };

  if (loading)
    return <div className="loading-spinner">Loading Dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  const { studentName, metrics, milestones } = data;

  // --- JSX remains exactly the same ---
  return (
    <div className="dashboard-container">
      <header className="welcome-header">
        <h1>Welcome back, {studentName}!</h1>
        <p>
          Track your research progress and stay organized with your milestones.
        </p>
      </header>

      <section className="overview-cards">
        <div className="card">
          <p>Overall Progress</p>
          <span className="icon-top-right">⤡</span>
          <div className="large-number">{metrics.overallProgressPercent}%</div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${metrics.overallProgressPercent}%` }}
            ></div>
          </div>
          <div className="completion-info">
            {metrics.overallCompletedItems} of {metrics.overallTotalItems} items
            completed
          </div>
        </div>
        <div className="card">
          <p>Active Milestones</p>
          <span className="icon-top-right">🎯</span>
          <div className="large-number">{metrics.activeMilestonesCount}</div>
          <div className="completion-info">Currently in progress</div>
        </div>
        <div className="card">
          <p>Completed Milestones</p>
          <span className="icon-top-right">🏆</span>
          <div className="large-number">{metrics.completedMilestonesCount}</div>
          <div className="completion-info">Great progress!</div>
        </div>
        <div className="card">
          <p>This Week</p>
          <span className="icon-top-right">📅</span>
          <div className="large-number">{metrics.weeklyTasksCount}</div>
          <div className="completion-info">Tasks to focus on</div>
        </div>
      </section>

      <section className="research-progress-tracker">
        <div className="tracker-header">
          <h2>Research Progress</h2>
          <div className="update-note">Click checkboxes to update status</div>
        </div>
        {milestones.map((m) => (
          <div key={m.id} className="milestone-item">
            <div
              className="milestone-header"
              onClick={() => toggleMilestone(m.id)}
            >
              <div className="title-group">
                <span
                  className={`chevron-icon ${m.isExpanded ? "expanded" : ""}`}
                >
                  &gt;
                </span>
                <span className="milestone-icon">@</span>
                <span className="milestone-title">{m.title}</span>
              </div>
              {renderStatusBadge(m.status)}
            </div>
            <div className="progress-info">
              <div
                className={`progress-bar-outer ${
                  m.status === "Completed" ? "completed-bar" : ""
                }`}
              >
                <div
                  className="progress-bar-inner"
                  style={{ width: `${m.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {m.completedCount}/{m.totalCount}
              </span>
            </div>
            {m.isExpanded && (
              <div className="sub-tasks">
                {m.tasks.map((task) => (
                  <div key={task.id} className="sub-task-item">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleTaskToggle(m.id, task.id)}
                      id={`task-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={task.isCompleted ? "completed-task" : ""}
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default StudentDashboard;
