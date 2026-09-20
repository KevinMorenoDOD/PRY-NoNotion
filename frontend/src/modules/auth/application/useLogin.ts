import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shared/interfaces/hooks/useAuth";
import { parseApiError } from "@shared/infrastructure/errorHandler";
import type { ApiError } from "@shared/domain/ApiError";

export function useLogin() {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const execute = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, error, isLoading };
}
