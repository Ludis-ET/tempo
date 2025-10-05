import { useQuery } from "@tanstack/react-query";
import { accountsEndpoints } from "../api/endpoints";
import type { ShippingAddress } from "../types";

type UseAccountShippingAddressesOptions = {
  enabled?: boolean;
};

function normalizeResponse(
  data: ShippingAddress[] | { shipping_addresses?: ShippingAddress[] }
): ShippingAddress[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.shipping_addresses)) {
    return data.shipping_addresses;
  }
  return [];
}

export function useAccountShippingAddresses(
  id: number | null,
  options: UseAccountShippingAddressesOptions = {}
) {
  const { enabled = true } = options;

  return useQuery<ShippingAddress[], Error>({
    queryKey: ["core", "accounts", "shipping-addresses", id],
    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
    queryFn: async () => {
      if (id == null) {
        throw new Error("Account id is required");
      }
      const response = await accountsEndpoints.shippingAddresses(id);
      return normalizeResponse(response);
    },
  });
}
