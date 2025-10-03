import { useQuery } from "@tanstack/react-query";

import { accountsEndpoints } from "../api/endpoints";
import type { AccountsListQuery, AccountsListResponse } from "../types";

export function useAccounts(query: AccountsListQuery) {
  return useQuery<AccountsListResponse, Error>({
    queryKey: ["core", "accounts", query],
    queryFn: () => accountsEndpoints.list(query),
  });
}
