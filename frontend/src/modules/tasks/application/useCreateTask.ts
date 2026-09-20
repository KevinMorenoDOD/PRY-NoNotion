import { useState } from "react";
import { tasksApi, type CreateTaskRequest } from "../infrastructure/tasksApi";
import { parseApiError } from "@shared/infrastructure/errorHandler";
import type { Task } from "../domain/Task";
import type { ApiError } from "@shared/domain/ApiError";

export function useCreateTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = async (data: CreateTaskRequest): Promise<Task | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const { data: created } = await tasksApi.create(data);
      return created;
    } catch (err) {
      setError(parseApiError(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, error, isLoading };
}
