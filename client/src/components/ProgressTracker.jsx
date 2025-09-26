import React from 'react'

function StatusBadge({status}){
  const cls = status === 'Completed' ? 'bg-green-100 text-green-800' : status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
  return <span className={`px-2 py-1 rounded text-sm ${cls}`}>{status}</span>
}

export default function ProgressTracker({progress}){
  if(!progress || !progress.milestones) return <div>No progress</div>
  return (
    <div className='space-y-4'>
      {progress.milestones.map(ms => (
        <div key={ms._id} className='p-4 border rounded'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl'>{ms.title}</h3>
            <StatusBadge status={ms.status} />
          </div>
          <div className='mt-3 space-y-3 pl-4'>
            {ms.stages.map(stage => (
              <div key={stage._id} className='border-l pl-4'>
                <div className='flex justify-between items-center'>
                  <strong>{stage.title}</strong>
                  <StatusBadge status={stage.status} />
                </div>
                <div className='mt-2 pl-4 space-y-2'>
                  {stage.tasks.map(task => (
                    <div key={task._id}>
                      <div className='flex justify-between items-center'>
                        <span>{task.title}</span>
                        <StatusBadge status={task.status} />
                      </div>
                      <div className='mt-1 pl-4 text-sm text-gray-700'>
                        {task.subtasks.map(sub => (
                          <div key={sub._id} className='flex items-center gap-2'>
                            <input type='checkbox' checked={sub.status==='Completed'} readOnly />
                            <span>{sub.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}