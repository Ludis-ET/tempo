import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../api/endpoints";
import { tokenStorage } from "../storage";
import type { LoginRequest, RegisterRequest, ChangePasswordRequest, UsersListQuery } from "../types";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => endpoints.login(body),
    onSuccess: (data: any) => {
      const tokens = (data && (data.tokens || ({}))) as { access?: string; refresh?: string };
      if (tokens?.access || tokens?.refresh) tokenStorage.set({ access: tokens.access ?? null, refresh: tokens.refresh ?? null });
      qc.invalidateQueries({ queryKey: ["auth", "current"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterRequest) => endpoints.register(body),
    onSuccess: (data: any) => {
      const tokens = (data && (data.tokens || ({}))) as { access?: string; refresh?: string };
      if (tokens?.access || tokens?.refresh) tokenStorage.set({ access: tokens.access ?? null, refresh: tokens.refresh ?? null });
      qc.invalidateQueries({ queryKey: ["auth", "current"] });
    },
  });
}

export function useCurrentUser() {
  return useQuery({ queryKey: ["auth", "current"], queryFn: () => endpoints.getCurrent() });
}

export function useProfile() {
  return useQuery({ queryKey: ["auth", "profile"], queryFn: () => endpoints.getProfile() });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => endpoints.patchProfile(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "profile"] });
      qc.invalidateQueries({ queryKey: ["auth", "current"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: (body: ChangePasswordRequest) => endpoints.changePassword(body) });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => endpoints.logout(),
    onSuccess: () => {
      tokenStorage.clear();
      qc.clear();
    },
  });
}

export function useUsers(query?: UsersListQuery) {
  return useQuery({ queryKey: ["auth", "users", query], queryFn: () => endpoints.listUsers(query) });
}
