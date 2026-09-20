import { apiClient } from "@shared/infrastructure/apiClient";
import type { TaskList } from "../domain/TaskList";

export interface CreateTaskListRequest {
  name: string;
  color?: string;
}

export interface RenameTaskListRequest {
  name: string;
}

export const taskListsApi = {
  getAll() {
    return apiClient.get<TaskList[]>("/task-lists");
  },

  getById(id: number) {
    return apiClient.get<TaskList>(`/task-lists/${id}`);
  },

  create(data: CreateTaskListRequest) {
    return apiClient.post<TaskList>("/task-lists", data);
  },

  rename(id: number, data: RenameTaskListRequest) {
    return apiClient.put<TaskList>(`/task-lists/${id}`, data);
  },

  delete(id: number) {
    return apiClient.delete(`/task-lists/${id}`);
  },
};
