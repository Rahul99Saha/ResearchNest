import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';

// --- SIMULATED BACKEND DATA ---
const fetchFacultyDashboardData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        facultyName: 'Dr. Emily White',
        students: [
          {
            id: 1,
            name: 'Alice Johnson',
            program: 'PhD Computer Science',
            status: 'On Track',
            overallProgress: 65,
            activeProjects: 2,
            lastActivity: '2 days ago',
            profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Alice%20J', // Placeholder profile pic
          },
          {
            id: 2,
            name: 'Bob Chen',
            program: 'MS Data Science',
            status: 'At Risk',
            overallProgress: 45,
            activeProjects: 1,
            lastActivity: '1 week ago',
            profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Bob%20C',
          },
          {
            id: 3,
            name: 'Carol Davis',
            program: 'PhD Psychology',
            status: 'Ahead',
            overallProgress: 85,
            activeProjects: 1,
            lastActivity: '1 day ago',
            profilePic: 'https://api.dicebear.com/7.x/initials/svg?seed=Carol%20D',
          },
          {
            id: 4,
            name: 'David Wilson',
            program: 'MS Computer Science',
            status: 'Behind',
            overallProgress: 30,
            activeProjects: 1,
            lastActivity: '3 days ago',
            profile: 'https://api.dicebear.com/7.x/initials/svg?seed=David%20W',
          },
        ],
      });
    }, 1200); // Simulate network delay
  });
};

// --- HELPER FUNCTIONS ---
const calculateFacultyMetrics = (students) => {
  const totalStudents = students.length;
  const onTrack = students.filter(s => s.status === 'On Track' || s.status === 'Ahead').length;
  const needAttention = students.filter(s => s.status === 'At Risk' || s.status === 'Behind').length;
  const totalProgress = students.reduce((sum, s) => sum + s.overallProgress, 0);
  const avgProgress = totalStudents > 0 ? (totalProgress / totalStudents).toFixed(1) : 0;

  return {
    totalStudents,
    onTrack,
    needAttention,
    avgProgress,
  };
};

const renderStudentStatusBadge = (status) => {
    let className = 'student-status-badge';
    if (status === 'On Track') className += ' on-track';
    else if (status === 'At Risk') className += ' at-risk';
    else if (status === 'Ahead') className += ' ahead';
    else if (status === 'Behind') className += ' behind';
    
    return <span className={className}>{status}</span>;
};

// --- REACT COMPONENT ---
const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Students');

  useEffect(() => {
    fetchFacultyDashboardData()
      .then(fetchedData => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch faculty dashboard data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-spinner">Loading Faculty Dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null; // Should not happen if loading/error are handled

  const { students } = data;
  const metrics = calculateFacultyMetrics(students);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All Students' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="faculty-dashboard-container">
      <header className="faculty-header">
        <h1>Faculty Dashboard</h1>
        <p>Monitor student progress and provide guidance across all research projects.</p>
      </header>

      {/* Overview Cards */}
      <section className="faculty-overview-cards">
        <div className="card">
          <div className="card-top-row">
            <p>Total Students</p>
            <span className="card-icon">⎘</span> {/* Placeholder icon */}
          </div>
          <div className="large-number">{metrics.totalStudents}</div>
          <div className="card-info">Under supervision</div>
        </div>

        <div className="card">
          <div className="card-top-row">
            <p>On Track</p>
            <span className="card-icon">⎘</span>
          </div>
          <div className="large-number">{metrics.onTrack}</div>
          <div className="card-info">Meeting expectations</div>
        </div>

        <div className="card">
          <div className="card-top-row">
            <p>Need Attention</p>
            <span className="card-icon">⎘</span>
          </div>
          <div className="large-number">{metrics.needAttention}</div>
          <div className="card-info">Require support</div>
        </div>

        <div className="card">
          <div className="card-top-row">
            <p>Avg Progress</p>
            <span className="card-icon">📈</span> {/* Placeholder for trend icon */}
          </div>
          <div className="large-number">{metrics.avgProgress}%</div>
          <div className="card-info">Across all students</div>
        </div>
      </section>

      {/* Student Overview Section */}
      <section className="student-overview-section">
        <div className="section-header">
          <h2>Student Overview</h2>
          <p>View and manage progress for all students under your supervision</p>
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
          {/* Dropdown for status filter (simplified for demo) */}
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
            filteredStudents.map(student => (
              <div key={student.id} className="student-card">
                <div className="student-card-header">
                  <img src={student.profilePic} alt={student.name} className="profile-pic" />
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <p>{student.program}</p>
                  </div>
                  {renderStudentStatusBadge(student.status)}
                </div>
                <div className="student-progress-section">
                  <p>Overall Progress</p>
                  <div className="student-progress-bar-outer">
                    <div
                      className="student-progress-bar-inner"
                      style={{ width: `${student.overallProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{student.overallProgress}%</span>
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
                <button className="view-details-btn">View Details</button>
              </div>
            ))
          ) : (
            <div className="no-students-found">No students match your criteria.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FacultyDashboard;