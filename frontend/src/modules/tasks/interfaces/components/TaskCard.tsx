import { useState } from "react";
import type { Task } from "../../domain/Task";
import type { TaskList } from "../../domain/TaskList";
import { Priority } from "../../domain/Priority";
import { TaskStatus } from "../../domain/TaskStatus";
import { statusColors, statusLabels } from "../statusStyles";

interface TaskCardProps {
  task: Task;
  taskLists: TaskList[];
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
  onOpen: (task: Task) => void;
}

const priorityColors: Record<Priority, string> = {
  [Priority.LOW]: "var(--color-accent-light)",
  [Priority.MEDIUM]: "var(--color-accent-primary)",
  [Priority.HIGH]: "var(--color-danger)",
};

export function TaskCard({
  task,
  taskLists,
  onStatusChange,
  onDelete,
  onOpen,
}: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const list = taskLists.find((l) => l.id === task.taskListId) ?? null;

  const nextStatus =
    task.status === TaskStatus.TODO
      ? TaskStatus.IN_PROGRESS
      : task.status === TaskStatus.IN_PROGRESS
        ? TaskStatus.DONE
        : TaskStatus.TODO;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(task.id));
        e.dataTransfer.effectAllowed = "move";
        setIsDragging(true);
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onOpen(task)}
      className="rounded-2xl p-5 transition-all duration-200 cursor-grab active:cursor-grabbing"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        boxShadow: "var(--shadow-neo-raised)",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="font-medium text-base break-words min-w-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          {task.title}
        </h3>
        <span
          className="px-2 py-1 rounded-lg font-medium shrink-0"
          style={{
            backgroundColor: priorityColors[task.priority],
            color: "#ffffff",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            backgroundColor: list?.color || "var(--color-accent-light)",
          }}
        />
        <span
          className="text-xs truncate"
          style={{ color: "var(--color-text-muted)" }}
        >
          {list ? list.name : "Unassigned"}
        </span>
      </div>

      {task.description && (
        <p
          className="text-sm mb-4 break-words line-clamp-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <p
          className="text-xs mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.id, nextStatus);
          }}
          title="Click to change status"
          className="px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            backgroundColor: statusColors[task.status],
            color: "#ffffff",
            boxShadow:
              task.status === TaskStatus.DONE
                ? "var(--shadow-neo-pressed-sm)"
                : "var(--shadow-neo-raised-sm)",
          }}
        >
          {statusLabels[task.status]}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-danger)",
            boxShadow: "var(--shadow-neo-raised-sm)",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
