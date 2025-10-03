export type ShippingAddress = {
  id: number;
  account_name: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  notes: string | null;
  external_code: string | null;
  is_active: boolean;
  legacy_id: number | null;
  created_by: number | null;
  updated_by: number | null;
  account: number;
};

export type Account = {
  id: number;
  account_manager_name: string | null;
  payment_method_name: string | null;
  carrier_name: string | null;
  vat_rate_name: string | null;
  shipping_addresses: ShippingAddress[];
  created_at: string;
  updated_at: string;
  code: string;
  company_name: string;
  vat_number: string | null;
  tax_code: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  abi: string | null;
  cab: string | null;
  iban: string | null;
  recipient_code: string | null;
  certified_email: string | null;
  notes: string | null;
  is_active: boolean;
  legacy_id: number | null;
  crm_id: string | null;
  created_by: number | null;
  updated_by: number | null;
  account_manager: number | null;
  payment_method: number | null;
  carrier: string | null;
  vat_rate: number | null;
  shipping_address: number | null;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type AccountsListQuery = {
  account_manager?: number;
  country?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  payment_method?: number;
  search?: string;
};

export type AccountsListResponse = PaginatedResponse<Account>;
