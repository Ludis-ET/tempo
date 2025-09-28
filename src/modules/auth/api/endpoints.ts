import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Profile,
  ChangePasswordRequest,
  RefreshRequest,
  RefreshResponse,
  UsersListQuery,
  UsersListResponse,
} from "../types";

export const endpoints = {
  login: (body: LoginRequest) => apiClient.post<LoginResponse>("/api/v1/auth/login/", body, false),
  register: (body: RegisterRequest) => apiClient.post<RegisterResponse>("/api/v1/auth/register/", body, false),
  // Profile
  getProfile: () => apiClient.get<Profile>("/api/v1/auth/profile/"),
  putProfile: (body: Profile) => apiClient.put<Profile>("/api/v1/auth/profile/", body),
  patchProfile: (body: Partial<Profile>) => apiClient.patch<Profile>("/api/v1/auth/profile/", body),
  // Change password
  changePassword: (body: ChangePasswordRequest) => apiClient.post<void>("/api/v1/auth/change-password/", body),
  // Current user
  getCurrent: () => apiClient.get<Profile>("/api/v1/auth/current/"),
  // Logout
  logout: () => apiClient.post<void>("/api/v1/auth/logout/"),
  // Refresh
  refresh: (body: RefreshRequest) => apiClient.post<RefreshResponse>("/api/v1/auth/refresh/", body, false),
  // List users (admin)
  listUsers: (query?: UsersListQuery) => apiClient.get<UsersListResponse>("/api/v1/auth/users/", query),
  // Optional: Forgot password placeholder (endpoint not provided)
  requestPasswordReset: (_email: string) => {
    throw new Error("Password reset endpoint not provided. Please implement and wire when available.");
  },
};
