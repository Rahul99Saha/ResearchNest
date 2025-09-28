import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

// --- SIMULATED BACKEND DATA ---
const fetchDashboardData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        studentName: 'Snigdha Pani',
        // Overall metrics are calculated based on milestones
        milestones: [
          { 
            id: 1, 
            title: 'Literature Review', 
            isExpanded: true,
            tasks: [
              { id: '1-1', title: 'Review key papers', isCompleted: true },
              { id: '1-2', title: 'Annotate sources', isCompleted: false },
              { id: '1-3', title: 'Write summary draft', isCompleted: false },
            ]
          },
          { 
            id: 2, 
            title: 'Initial Research', 
            isExpanded: false,
            tasks: [
              { id: '2-1', title: 'Define scope', isCompleted: true },
              { id: '2-2', title: 'Initial concept proposal', isCompleted: true },
            ]
          },
          { 
            id: 3, 
            title: 'Analysis & Synthesis', 
            isExpanded: false,
            tasks: [
              { id: '3-1', title: 'Develop research questions', isCompleted: false },
              { id: '3-2', title: 'Establish preliminary model', isCompleted: false },
            ]
          },
          { 
            id: 4, 
            title: 'Methodology Development', 
            isExpanded: false,
            tasks: [
              { id: '4-1', title: 'Select methodology', isCompleted: false },
            ]
          },
        ]
      });
    }, 1000); // Simulate network delay
  });
};

// --- HELPER FUNCTIONS ---
const calculateMilestoneProgress = (milestones) => {
  let totalTasks = 0;
  let completedTasks = 0;
  let activeMilestones = 0;
  let completedMilestones = 0;

  const processedMilestones = milestones.map(milestone => {
    const total = milestone.tasks.length;
    const completed = milestone.tasks.filter(t => t.isCompleted).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    const status = 
      progress === 100 ? 'Completed' : 
      progress > 0 ? 'In Progress' : 'Not Started';

    totalTasks += total;
    completedTasks += completed;
    if (status === 'Completed') completedMilestones++;
    if (status === 'In Progress') activeMilestones++;

    return { ...milestone, progress, status, completedCount: completed, totalCount: total };
  });

  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return { 
    processedMilestones,
    metrics: {
      overallProgressPercent: overallProgress.toFixed(1),
      overallCompletedItems: completedTasks,
      overallTotalItems: totalTasks,
      activeMilestonesCount: activeMilestones,
      completedMilestonesCount: completedMilestones,
      weeklyTasksCount: 3, // Hardcoded for this demo
    }
  };
};

// --- REACT COMPONENT ---
const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData()
      .then(fetchedData => {
        const { processedMilestones, metrics } = calculateMilestoneProgress(fetchedData.milestones);
        setData({ 
          ...fetchedData, 
          milestones: processedMilestones, 
          metrics 
        });
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      });
  }, []);

  // Handler for checking/unchecking a subtask
  const handleTaskToggle = (milestoneId, taskId) => {
    if (!data) return;

    const updatedMilestones = data.milestones.map(m => {
      if (m.id === milestoneId) {
        const updatedTasks = m.tasks.map(t =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        return { ...m, tasks: updatedTasks };
      }
      return m;
    });

    const { processedMilestones, metrics } = calculateMilestoneProgress(updatedMilestones);
    setData(prevData => ({ 
        ...prevData, 
        milestones: processedMilestones, 
        metrics 
    }));
  };

  // Handler for expanding/collapsing a milestone
  const toggleMilestone = (milestoneId) => {
    if (!data) return;
    const updatedMilestones = data.milestones.map(m =>
      m.id === milestoneId ? { ...m, isExpanded: !m.isExpanded } : m
    );
    setData(prevData => ({ ...prevData, milestones: updatedMilestones }));
  };

  const renderStatusBadge = (status) => {
    let className = 'status-badge';
    let icon = '';

    if (status === 'Completed') { className += ' completed'; icon = '✔'; }
    else if (status === 'In Progress') { className += ' in-progress'; icon = '◷'; }
    else { className += ' not-started'; icon = '◯'; }

    return (
      <div className={className}>
        {icon}
        {status}
      </div>
    );
  };
  
  if (loading) return <div className="loading-spinner">Loading Dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null; // Should not happen if loading/error are handled

  const { studentName, metrics, milestones } = data;

  return (
    <div className="dashboard-container">
      {/* -------------------------------------- */}
      {/* 1. Welcome and Overview Section (Top)  */}
      {/* -------------------------------------- */}
      <header className="welcome-header">
        <h1>Welcome back, {studentName}!</h1>
        <p>Track your research progress and stay organized with your milestones.</p>
      </header>

      <section className="overview-cards">
        {/* Card 1: Overall Progress */}
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
            {metrics.overallCompletedItems} of {metrics.overallTotalItems} items completed
          </div>
        </div>

        {/* Card 2, 3, 4 (Simplified for demo) */}
        <div className="card"><p>Active Milestones</p><span className="icon-top-right">🎯</span><div className="large-number">{metrics.activeMilestonesCount}</div><div className="completion-info">Currently in progress</div></div>
        <div className="card"><p>Completed Milestones</p><span className="icon-top-right">🏆</span><div className="large-number">{metrics.completedMilestonesCount}</div><div className="completion-info">Great progress!</div></div>
        <div className="card"><p>This Week</p><span className="icon-top-right">📅</span><div className="large-number">{metrics.weeklyTasksCount}</div><div className="completion-info">Tasks to focus on</div></div>
      </section>

      {/* -------------------------------------- */}
      {/* 2. Research Progress Tracker (Bottom)  */}
      {/* -------------------------------------- */}
      <section className="research-progress-tracker">
        <div className="tracker-header">
          <h2>Research Progress</h2>
          <div className="update-note">Click checkboxes to update status</div>
        </div>

        {milestones.map((m) => (
          <div key={m.id} className="milestone-item">
            <div className="milestone-header" onClick={() => toggleMilestone(m.id)}>
              <div className="title-group">
                <span className={`chevron-icon ${m.isExpanded ? 'expanded' : ''}`}>
                  &gt;
                </span>
                <span className="milestone-icon">@</span>
                <span className="milestone-title">{m.title}</span>
              </div>
              {renderStatusBadge(m.status)}
            </div>

            <div className="progress-info">
              <div className={`progress-bar-outer ${m.status === 'Completed' ? 'completed-bar' : ''}`}>
                <div
                  className="progress-bar-inner"
                  style={{ width: `${m.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {m.completedCount}/{m.totalCount}
              </span>
            </div>
            
            {/* Sub-tasks Section (Conditionally rendered) */}
            {m.isExpanded && (
              <div className="sub-tasks">
                {m.tasks.map(task => (
                  <div key={task.id} className="sub-task-item">
                    <input 
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleTaskToggle(m.id, task.id)}
                      id={`task-${task.id}`}
                    />
                    <label htmlFor={`task-${task.id}`} className={task.isCompleted ? 'completed-task' : ''}>
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