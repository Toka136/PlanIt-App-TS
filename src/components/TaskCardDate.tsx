import React from "react";
import type{ Task, TaskStat } from "../Types/TaskType";

interface TaskCardProps {
  task: TaskStat;
}

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  High: "bg-red-900/40 text-red-400 border border-red-800/40",
  Medium: "bg-yellow-900/40 text-yellow-400 border border-yellow-800/40",
  Low: "bg-teal-900/40 text-teal-400 border border-teal-800/40",
};

const STATUS_STYLES: Record<Task["status"], string> = {
  "In Progress": "bg-purple-900/40 text-purple-400 border border-purple-800/40",
  "Not Started": "bg-neutral-800/60 text-neutral-400 border border-neutral-700/40",
  "Completed": "bg-green-900/40 text-green-400 border border-green-800/40",
};

const DUE_DATE_COLOR: Record<string, string> = {
  "tomorrow": "text-orange-400",
  "in 2 days": "text-green-400",
  "overdue": "text-gray-400",
  "today": "text-red-600",
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
<>
{console.log("task",task)}
    <div className="bg-[#222222] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 hover:bg-[#2a2a2a] hover:border-white/[0.1] transition-all duration-200 cursor-pointer group">
      {/* Left: title + badges */}
      <div className="flex flex-col gap-2 min-w-0">
        <span className="text-white font-medium text-sm truncate group-hover:text-purple-300 transition-colors duration-200">
          {task.title}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[task.status]}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Right: due date */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-gray-500 text-xs">Due Date</span>
        <span
                    className={`text-sm font-semibold ${DUE_DATE_COLOR[task.relativeTime] ?? "text-white"}`}

        >
          {task.dueDate.split("T")[0]}
        </span>
        <span className="text-gray-500 text-xs">{task.relativeTime}</span>
      </div>
    </div>
    </>
  );
};

export default TaskCard;
