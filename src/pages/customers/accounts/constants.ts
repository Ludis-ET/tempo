import type { AccountsOrderOption } from "./types";

export const ORDER_OPTIONS: AccountsOrderOption[] = [
  { label: "Name (A → Z)", value: "company_name" },
  { label: "Name (Z → A)", value: "-company_name" },
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
  { label: "Recently updated", value: "-updated_at" },
  { label: "Least recently updated", value: "updated_at" },
];
