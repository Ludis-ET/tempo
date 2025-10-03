import { describe, expect, it } from "vitest";
import type { AccountsListQuery } from "../types";
import { normalizeAccountsQuery } from "./endpoints";

describe("normalizeAccountsQuery", () => {
  it("returns undefined when no query is provided", () => {
    expect(normalizeAccountsQuery()).toBeUndefined();
  });

  it("removes empty and nullish values", () => {
    const query: AccountsListQuery = {
      search: "",
      country: undefined,
      page: 2,
      ordering: "company_name",
    };

    expect(normalizeAccountsQuery(query)).toEqual({
      page: 2,
      ordering: "company_name",
    });
  });

  it("keeps falsy but meaningful values", () => {
    const query: AccountsListQuery = {
      page: 0,
      search: "Acme",
      is_active: false,
    };

    expect(normalizeAccountsQuery(query)).toEqual({
      page: 0,
      search: "Acme",
      is_active: false,
    });
  });
});
