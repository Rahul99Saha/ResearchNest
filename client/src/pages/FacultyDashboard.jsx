import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function FacultyDashboard() {
  const [progress, setProgress] = useState([]);
  const [milestone, setMilestone] = useState('');
  const [studentId, setStudentId] = useState('');

  const fetchProgress = async () => {
    const res = await api.get('/progress/all');
    setProgress(res.data);
  };

  useEffect(() => { fetchProgress(); }, []);

  const addMilestone = async () => {
    if (!milestone || !studentId) return;
    await api.post('/progress', { milestone, studentId });
    setMilestone('');
    fetchProgress();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/progress/${id}`, { status });
    fetchProgress();
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Students Progress</h2>

      <div className="mb-4 flex space-x-2">
        <input
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          placeholder="Student ID"
          className="border rounded px-3 py-2"
        />
        <input
          value={milestone}
          onChange={e => setMilestone(e.target.value)}
          placeholder="New milestone"
          className="border rounded px-3 py-2"
        />
        <button onClick={addMilestone} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      <ul className="space-y-2">
        {progress.map(p => (
          <li key={p._id} className="flex justify-between border p-2 rounded">
            <span>{p.student.name} ({p.student.email}) - {p.milestone} - {p.status}</span>
            {p.status === 'pending' && (
              <button onClick={() => updateStatus(p._id, 'completed')} className="bg-green-500 text-white px-2 rounded">
                Mark Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
