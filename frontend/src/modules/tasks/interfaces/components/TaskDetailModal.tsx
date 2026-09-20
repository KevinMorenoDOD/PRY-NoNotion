import { useEffect } from "react";
import type { Task } from "../../domain/Task";
import { Priority } from "../../domain/Priority";
import { TaskStatus } from "../../domain/TaskStatus";
import type { TaskList } from "../../domain/TaskList";
import { statusColors, statusLabels } from "../statusStyles";

interface TaskDetailModalProps {
  task: Task;
  taskLists: TaskList[];
  onClose: () => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const priorityColors: Record<Priority, string> = {
  [Priority.LOW]: "var(--color-accent-light)",
  [Priority.MEDIUM]: "var(--color-accent-primary)",
  [Priority.HIGH]: "var(--color-danger)",
};

export function TaskDetailModal({
  task,
  taskLists,
  onClose,
  onStatusChange,
  onDelete,
}: TaskDetailModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const nextStatus =
    task.status === TaskStatus.TODO
      ? TaskStatus.IN_PROGRESS
      : task.status === TaskStatus.IN_PROGRESS
        ? TaskStatus.DONE
        : TaskStatus.TODO;

  const taskList = taskLists.find((l) => l.id === task.taskListId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          boxShadow: "var(--shadow-neo-raised)",
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2
            className="font-medium text-lg break-words min-w-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg cursor-pointer transition-all duration-200 shrink-0"
            style={{
              color: "var(--color-heading)",
              boxShadow: "var(--shadow-neo-raised-sm)",
              fontSize: "12px",
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span
            className="px-2 py-1 rounded-lg font-medium"
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
          <span
            className="px-2 py-1 rounded-lg font-medium"
            style={{
              backgroundColor: statusColors[task.status],
              color: "#ffffff",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {statusLabels[task.status]}
          </span>
          {taskList && (
            <span
              className="px-2 py-1 rounded-lg font-medium"
              style={{
                backgroundColor: taskList.color || "var(--color-accent-light)",
                color: "#ffffff",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {taskList.name}
            </span>
          )}
        </div>

        {task.description ? (
          <p
            className="text-sm mb-5 whitespace-pre-wrap break-words"
            style={{ color: "var(--color-text-primary)" }}
          >
            {task.description}
          </p>
        ) : (
          <p
            className="text-sm mb-5 italic"
            style={{ color: "var(--color-text-muted)" }}
          >
            No description
          </p>
        )}

        {task.dueDate && (
          <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
            Due: {new Date(task.dueDate).toLocaleString()}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
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
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
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
    </div>
  );
}
