import { apiClient } from "@shared/infrastructure/apiClient";
import type { User } from "@shared/domain/User";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export const authApi = {
  login(data: LoginRequest) {
    return apiClient.post<AuthResponse>("/v1/auth/login", data);
  },

  register(data: RegisterRequest) {
    return apiClient.post<AuthResponse>("/v1/auth/register", data);
  },

  logout() {
    return apiClient.post("/v1/auth/logout");
  },

  me() {
    return apiClient.get<User>("/v1/auth/me");
  },
};
