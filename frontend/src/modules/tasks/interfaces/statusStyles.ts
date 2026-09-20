import { TaskStatus } from "../domain/TaskStatus";

export const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
};

export const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "var(--color-text-muted)",
  [TaskStatus.IN_PROGRESS]: "var(--color-accent-primary)",
  [TaskStatus.DONE]: "var(--color-success)",
};
