import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsEndpoints } from "../api/endpoints";
import type { Account, AccountPayload } from "../types";

type UpdateAccountArgs = {
  id: number;
  payload: AccountPayload;
};

type DeleteAccountArgs = {
  id: number;
};

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation<Account, Error, AccountPayload>({
    mutationFn: (payload) => accountsEndpoints.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["core", "accounts"], exact: false });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation<Account, Error, UpdateAccountArgs>({
    mutationFn: ({ id, payload }) => accountsEndpoints.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["core", "accounts"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["core", "accounts", "detail", variables.id] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteAccountArgs>({
    mutationFn: ({ id }) => accountsEndpoints.delete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["core", "accounts"], exact: false });
      queryClient.removeQueries({ queryKey: ["core", "accounts", "detail", variables.id] });
    },
  });
}
