import React, { useState } from "react";
import { Badge } from "./ui/badge";

export function ProgressTracker({ data }) {
  return (
    <div className="space-y-4">
      {data.milestones.map((milestone) => (
        <MilestoneItem key={milestone.id} milestone={milestone} />
      ))}
    </div>
  );
}

function MilestoneItem({ milestone }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h4 className="font-medium">{milestone.title}</h4>
          <p className="text-sm text-muted-foreground">
            {milestone.description}
          </p>
        </div>
        <Badge>{milestone.status}</Badge>
      </div>

      {open && milestone.stages?.length > 0 && (
        <div className="mt-3 space-y-2 pl-4 border-l">
          {milestone.stages.map((stage) => (
            <StageItem key={stage.id} stage={stage} />
          ))}
        </div>
      )}
    </div>
  );
}

function StageItem({ stage }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-2 border rounded">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>{stage.title}</span>
        <Badge>{stage.status}</Badge>
      </div>

      {open && stage.tasks?.length > 0 && (
        <div className="mt-2 pl-4 space-y-1 border-l">
          {stage.tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-2 border rounded">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>{task.title}</span>
        <Badge>{task.status}</Badge>
      </div>

      {open && task.subtasks?.length > 0 && (
        <div className="mt-2 pl-4 space-y-1 border-l">
          {task.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center justify-between text-sm p-1 rounded bg-muted/40"
            >
              <span>{subtask.title}</span>
              <Badge>{subtask.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
