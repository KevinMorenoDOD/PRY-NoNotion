import type { BaseEntity } from "@shared/domain/BaseEntity";
import type { Priority } from "./Priority";
import type { TaskStatus } from "./TaskStatus";

export interface Task extends BaseEntity {
  taskListId: number | null;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  status: TaskStatus;
}
