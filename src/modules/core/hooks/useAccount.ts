import { useQuery } from "@tanstack/react-query";
import { accountsEndpoints } from "../api/endpoints";
import type { Account } from "../types";

type UseAccountOptions = {
  enabled?: boolean;
};

export function useAccount(id: number | null, options: UseAccountOptions = {}) {
  const { enabled = true } = options;

  return useQuery<Account, Error>({
    queryKey: ["core", "accounts", "detail", id],
    queryFn: () => {
      if (id == null) {
        throw new Error("Account id is required");
      }
      return accountsEndpoints.retrieve(id);
    },
    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
  });
}
