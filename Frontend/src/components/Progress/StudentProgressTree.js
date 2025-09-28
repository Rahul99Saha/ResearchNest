import React, { useState } from "react";
import "../Dashboard/FacultyDashboard.css"; // Uses the same stylesheet

// Helper to render the status badge for each item
const renderNodeStatus = (status) => {
  const statusClass = status
    ? status.toLowerCase().replace(" ", "-")
    : "locked";
  return <span className={`node-status-badge ${statusClass}`}>{status}</span>;
};

// --- NEW: Sub-component for override controls ---
const OverrideNode = ({ studentId, node, onOverride }) => {
  const [selectedStatus, setSelectedStatus] = useState(node.status);

  const handleUpdate = () => {
    if (selectedStatus !== node.status) {
      onOverride(studentId, node._id, selectedStatus);
    }
  };

  return (
    <div className="node-header">
      <span className="node-title">{node.title}</span>
      {renderNodeStatus(node.status)}
      <div className="override-controls">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="override-select"
        >
          <option value="Locked">Locked</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={handleUpdate} className="override-btn">
          Update
        </button>
      </div>
    </div>
  );
};

const StudentProgressTree = ({ studentId, progress, onOverride }) => {
  if (!progress || !progress.milestones || progress.milestones.length === 0) {
    return (
      <div className="progress-tree-container">
        <p className="no-progress-note">
          No progress instance has been set up for this student yet.
        </p>
      </div>
    );
  }

  return (
    <div className="progress-tree-container">
      {progress.milestones.map((milestone) => (
        <div key={milestone._id} className="tree-node milestone">
          <OverrideNode
            studentId={studentId}
            node={milestone}
            onOverride={onOverride}
          />
          {milestone.stages?.map((stage) => (
            <div key={stage._id} className="tree-node stage">
              <OverrideNode
                studentId={studentId}
                node={stage}
                onOverride={onOverride}
              />
              {stage.tasks?.map((task) => (
                <div key={task._id} className="tree-node task">
                  <OverrideNode
                    studentId={studentId}
                    node={task}
                    onOverride={onOverride}
                  />
                  {task.subtasks?.map((subtask) => (
                    <div key={subtask._id} className="tree-node subtask">
                      <OverrideNode
                        studentId={studentId}
                        node={subtask}
                        onOverride={onOverride}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StudentProgressTree;
