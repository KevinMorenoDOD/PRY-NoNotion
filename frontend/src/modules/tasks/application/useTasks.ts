import { useState, useEffect, useCallback } from "react";
import { tasksApi, type EditTaskRequest } from "../infrastructure/tasksApi";
import { parseApiError } from "@shared/infrastructure/errorHandler";
import type { Task } from "../domain/Task";
import type { ApiError } from "@shared/domain/ApiError";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const editTask = async (id: number, data: EditTaskRequest) => {
    const { data: updated } = await tasksApi.edit(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTask = async (id: number) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks,
    isLoading,
    error,
    editTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
