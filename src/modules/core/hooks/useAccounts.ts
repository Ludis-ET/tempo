import { useQuery } from "@tanstack/react-query";
import { accountsEndpoints } from "../api/endpoints";
import type { AccountsListQuery } from "../types";

export function useAccounts(query: AccountsListQuery) {
  return useQuery({
    queryKey: ["core", "accounts", query],
    queryFn: () => accountsEndpoints.list(query),
    keepPreviousData: true,
  });
}
