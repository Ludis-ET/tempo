import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountShippingAddresses } from "@/modules/core/hooks/useAccountShippingAddresses";
import type { ShippingAddress } from "@/modules/core/types";

function formatAddress(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(", ");
}

type AccountShippingAddressesProps = {
  accountId: number | null;
  enabled?: boolean;
};

export function AccountShippingAddresses({
  accountId,
  enabled = true,
}: AccountShippingAddressesProps) {
  const { data, isLoading, isFetching, error } = useAccountShippingAddresses(
    accountId,
    { enabled }
  );

  const addresses = useMemo<ShippingAddress[]>(() => data ?? [], [data]);
  const isBusy = isLoading || isFetching;

  if (!accountId) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-lg font-semibold">Shipping addresses</h4>
        <Badge variant="outline">{addresses.length}</Badge>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load shipping addresses</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      {isBusy ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid gap-3">
          {addresses.map((address) => (
            <div key={address.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">
                  {address.name || address.account_name}
                </div>
                <Badge variant={address.is_active ? "default" : "secondary"}>
                  {address.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  {formatAddress([
                    address.address,
                    address.city,
                    address.province,
                    address.postal_code,
                    address.country,
                  ])}
                </div>
                <div className="flex flex-wrap gap-2">
                  {address.phone ? <span>☎ {address.phone}</span> : null}
                  {address.email ? <span>✉ {address.email}</span> : null}
                </div>
              </div>
              {address.notes ? (
                <p className="text-xs text-muted-foreground">{address.notes}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No shipping addresses available for this account yet.
        </p>
      )}
    </section>
  );
}
