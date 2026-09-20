import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shared/interfaces/hooks/useAuth";
import { parseApiError } from "@shared/infrastructure/errorHandler";
import type { ApiError } from "@shared/domain/ApiError";

export function useRegister() {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const execute = async (email: string, password: string, displayName: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await register(email, password, displayName);
      navigate("/dashboard");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, error, isLoading };
}
