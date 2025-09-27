import React from 'react';

function Node({ node, onToggle }){
  return (
    <div style={{ marginLeft: 16 }}>
      <div>
        <strong>{node.title}</strong> — <em>{node.status}</em>
        <button onClick={()=>onToggle(node._id, node.status === 'Completed' ? 'Locked' : 'Completed')}>Toggle</button>
      </div>
      {node.stages && node.stages.map(s=> <Node key={s._id} node={s} onToggle={onToggle} />)}
      {node.tasks && node.tasks.map(t=> <Node key={t._id} node={t} onToggle={onToggle} />)}
      {node.subtasks && node.subtasks.map(st=> <Node key={st._id} node={st} onToggle={onToggle} />)}
    </div>
  );
}

export default function ProgressTree({ data, onToggle }){
  if (!data || !data.milestones) return <div>No progress</div>;
  return (
    <div>
      {data.milestones.map(ms => (
        <div key={ms._id} style={{ border:'1px solid #ddd', padding:8, margin:8 }}>
          <Node node={ms} onToggle={onToggle} />
        </div>
      ))}
    </div>
  );
}
