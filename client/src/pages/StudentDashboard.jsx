import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function StudentDashboard() {
  const [progress, setProgress] = useState([]);
  const [milestone, setMilestone] = useState('');

  const fetchProgress = async () => {
    const res = await api.get('/progress');
    setProgress(res.data);
  };

  useEffect(() => { fetchProgress(); }, []);

  const addMilestone = async () => {
    if (!milestone) return;
    await api.post('/progress', { milestone });
    setMilestone('');
    fetchProgress();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/progress/${id}`, { status });
    fetchProgress();
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>

      <div className="mb-4">
        <input
          value={milestone}
          onChange={e => setMilestone(e.target.value)}
          placeholder="New milestone"
          className="border rounded px-3 py-2 mr-2"
        />
        <button onClick={addMilestone} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      <ul className="space-y-2">
        {progress.map(p => (
          <li key={p._id} className="flex justify-between border p-2 rounded">
            <span>{p.milestone} - {p.status}</span>
            {p.status === 'pending' && (
              <button onClick={() => updateStatus(p._id, 'completed')} className="bg-green-500 text-white px-2 rounded">
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
