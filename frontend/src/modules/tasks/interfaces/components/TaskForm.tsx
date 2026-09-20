import { useState, type FormEvent } from "react";
import { Priority } from "../../domain/Priority";
import { TaskStatus } from "../../domain/TaskStatus";
import type { CreateTaskRequest } from "../../infrastructure/tasksApi";

interface TaskFormProps {
  taskListId: number | null;
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  isLoading: boolean;
}

export function TaskForm({ taskListId, onSubmit, isLoading }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      listId: taskListId,
      title,
      description: description || undefined,
      priority,
      taskStatus: status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    setIsOpen(false);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow duration-200"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        boxShadow: isOpen ? "var(--shadow-neo-pressed-sm)" : "var(--shadow-neo-raised)",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-heading)",
        }}
      >
        <span className="font-medium">New Task</span>
        <span
          className="text-base leading-none transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            placeholder="Task title"
            className="w-full px-4 py-3 rounded-xl border-none outline-none transition-shadow"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              color: "var(--color-text-primary)",
              boxShadow: "var(--shadow-neo-raised-sm)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "var(--shadow-neo-raised-sm), 0 0 0 2px var(--color-accent-primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
            }}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-none outline-none transition-shadow resize-none"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              color: "var(--color-text-primary)",
              boxShadow: "var(--shadow-neo-raised-sm)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "var(--shadow-neo-raised-sm), 0 0 0 2px var(--color-accent-primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
            }}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="task-due-date"
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-heading)",
              }}
            >
              Due date &amp; time
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-none outline-none transition-shadow cursor-pointer"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-neo-raised-sm)",
                colorScheme: "light dark",
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  "var(--shadow-neo-raised-sm), 0 0 0 2px var(--color-accent-primary)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
              }}
            />
          </div>

          <div className="flex gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="flex-1 px-4 py-3 rounded-xl border-none outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-neo-raised-sm)",
              }}
            >
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="flex-1 px-4 py-3 rounded-xl border-none outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-neo-raised-sm)",
              }}
            >
              {Object.values(TaskStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#ffffff",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                boxShadow: "var(--shadow-neo-raised-sm)",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-pressed-sm)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-neo-raised-sm)";
              }}
            >
              {isLoading ? "Creating..." : "Add Task"}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                boxShadow: "var(--shadow-neo-raised-sm)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
