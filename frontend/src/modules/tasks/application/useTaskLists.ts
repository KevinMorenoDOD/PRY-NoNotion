import { useState, useEffect, useCallback } from "react";
import { taskListsApi, type CreateTaskListRequest } from "../infrastructure/taskListsApi";
import { parseApiError } from "@shared/infrastructure/errorHandler";
import type { TaskList } from "../domain/TaskList";
import type { ApiError } from "@shared/domain/ApiError";

export function useTaskLists() {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchTaskLists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await taskListsApi.getAll();
      setTaskLists(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);

  const createTaskList = async (data: CreateTaskListRequest) => {
    const { data: newList } = await taskListsApi.create(data);
    setTaskLists((prev) => [...prev, newList]);
    return newList;
  };

  const renameTaskList = async (id: number, name: string) => {
    const { data: renamed } = await taskListsApi.rename(id, { name });
    setTaskLists((prev) => prev.map((tl) => (tl.id === id ? renamed : tl)));
    return renamed;
  };

  const deleteTaskList = async (id: number) => {
    await taskListsApi.delete(id);
    setTaskLists((prev) => prev.filter((tl) => tl.id !== id));
  };

  return {
    taskLists,
    isLoading,
    error,
    createTaskList,
    renameTaskList,
    deleteTaskList,
    refetch: fetchTaskLists,
  };
}
