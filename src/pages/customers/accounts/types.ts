import type { ChangeEvent, FormEvent } from "react";

export type FilterSelectOption = {
  value: string;
  label: string;
};

export type FilterFormState = {
  search: string;
  accountManager: string;
  country: string;
  paymentMethod: string;
  isActive: "all" | "true" | "false";
  ordering: string;
};

export type DetailTab = "overview" | "edit";

export type AccountsOrderOption = {
  label: string;
  value: string;
};

export type AccountsFiltersHandlers = {
  onInputChange: (
    key: keyof FilterFormState
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (key: keyof FilterFormState) => (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
};
