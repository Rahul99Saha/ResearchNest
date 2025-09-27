function computeParentStatusFromChildren(children) {
  if (!children || children.length === 0) return 'Completed';
  const allCompleted = children.every(c => c.status === 'Completed');
  if (allCompleted) return 'Completed';
  const anyInProgress = children.some(c => c.status === 'In Progress');
  if (anyInProgress) return 'In Progress';
  const anyCompleted = children.some(c => c.status === 'Completed');
  if (anyCompleted) return 'In Progress';
  return 'Locked';
}

function propagateStatus(milestones) {
  milestones.forEach(ms => {
    ms.stages.forEach(st => {
      st.tasks.forEach(t => {
        t.status = computeParentStatusFromChildren(t.subtasks);
      });
      st.status = computeParentStatusFromChildren(st.tasks);
    });
    ms.status = computeParentStatusFromChildren(ms.stages);
  });
}

function setNodeStatusById(milestones, nodeId, newStatus) {
  for (const ms of milestones) {
    if (ms._id.toString() === nodeId.toString()) { const old = ms.status; ms.status = newStatus; return { oldStatus: old }; }
    for (const st of ms.stages) {
      if (st._id.toString() === nodeId.toString()) { const old = st.status; st.status = newStatus; return { oldStatus: old }; }
      for (const t of st.tasks) {
        if (t._id.toString() === nodeId.toString()) { const old = t.status; t.status = newStatus; return { oldStatus: old }; }
        for (const s of t.subtasks) {
          if (s._id.toString() === nodeId.toString()) { const old = s.status; s.status = newStatus; return { oldStatus: old }; }
        }
      }
    }
  }
  return null;
}

module.exports = { propagateStatus, setNodeStatusById };
