import { apiClient } from "@/modules/auth/api/client";
import type {
  Account,
  AccountsListQuery,
  AccountsListResponse,
} from "../types";

const BASE_URL = "/api/v1/core/accounts/";

export function normalizeAccountsQuery(
  query?: AccountsListQuery
): Record<string, unknown> | undefined {
  if (!query) return undefined;
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    payload[key] = value;
  }
  return payload;
}

export const accountsEndpoints = {
  list: (query?: AccountsListQuery) =>
    apiClient.get<AccountsListResponse>(
      BASE_URL,
      normalizeAccountsQuery(query)
    ),
  retrieve: (id: number) => apiClient.get<Account>(`${BASE_URL}${id}/`),
};
