import React, { useState, useEffect, useContext } from 'react';
import API from '../../api.js';
import ProgressTree from '../Progress/ProgressTree.js';
import { AuthContext } from '../../contexts/AuthContext.js';
export default function StudentDashboard(){
  const [progress,setProgress]=useState(null);
  const { user } = useContext(AuthContext);
  useEffect(()=>{ API.get('/progress/me').then(r=>setProgress(r.data)).catch(()=>{}); },[]);
  const onToggle = async (nodeId, newStatus) => {
    const old = JSON.stringify(progress);
    function mutateNode(obj){
      for(const ms of obj.milestones){ if(ms._id===nodeId){ ms.status=newStatus; return true; } for(const st of ms.stages){ if(st._id===nodeId){ st.status=newStatus; return true;} for(const t of st.tasks){ if(t._id===nodeId){ t.status=newStatus; return true;} for(const s of t.subtasks){ if(s._id===nodeId){ s.status=newStatus; return true; } } } } }
      return false;
    }
    const copy = JSON.parse(JSON.stringify(progress)); if(mutateNode(copy)){ setProgress(copy); }
    try{ const res = await API.patch(`/progress/node/${nodeId}`, { status: newStatus }); setProgress(res.data); } catch(err){ alert('Update failed'); setProgress(JSON.parse(old)); }
  };
  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome {user?.name}</h2>
      <ProgressTree data={progress} onToggle={onToggle} />
    </div>
  );
}
