import { apiClient } from "@shared/infrastructure/apiClient";
import type { Task } from "../domain/Task";
import type { Priority } from "../domain/Priority";
import type { TaskStatus } from "../domain/TaskStatus";

export interface CreateTaskRequest {
  listId: number | null;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  taskStatus?: TaskStatus;
}

export interface EditTaskRequest {
  listId?: number;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  taskStatus?: TaskStatus;
}

export const tasksApi = {
  getAll() {
    return apiClient.get<Task[]>("/tasks");
  },

  getById(id: number) {
    return apiClient.get<Task>(`/tasks/${id}`);
  },

  create(data: CreateTaskRequest) {
    return apiClient.post<Task>("/tasks", data);
  },

  edit(id: number, data: EditTaskRequest) {
    return apiClient.put<Task>(`/tasks/${id}`, data);
  },

  delete(id: number) {
    return apiClient.delete<Task>(`/tasks/${id}`);
  },
};
