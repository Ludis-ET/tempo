import { useMemo, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Account } from "../types";

type AccountOverviewProps = {
  account: Account;
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm leading-5">
        {value ?? <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

function formatAddress(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(", ");
}

export function AccountOverview({ account }: AccountOverviewProps) {
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold">{account.company_name}</h3>
          <Badge variant={account.is_active ? "default" : "secondary"}>
            {account.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Account code" value={account.code} />
          <DetailRow
            label="Last updated"
            value={
              account.updated_at
                ? dateFormatter.format(new Date(account.updated_at))
                : "—"
            }
          />
          <DetailRow
            label="Account manager"
            value={
              account.account_manager_name ? (
                <div className="space-y-0.5">
                  <div>{account.account_manager_name}</div>
                  {account.account_manager != null ? (
                    <div className="text-xs text-muted-foreground">
                      ID #{account.account_manager}
                    </div>
                  ) : null}
                </div>
              ) : (
                "—"
              )
            }
          />
          <DetailRow
            label="Payment method"
            value={
              account.payment_method_name ? (
                <div className="space-y-0.5">
                  <div>{account.payment_method_name}</div>
                  {account.payment_method != null ? (
                    <div className="text-xs text-muted-foreground">
                      ID #{account.payment_method}
                    </div>
                  ) : null}
                </div>
              ) : (
                "—"
              )
            }
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h4 className="text-lg font-semibold">Contact details</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Email" value={account.email} />
          <DetailRow label="Phone" value={account.phone} />
          <DetailRow label="Certified email" value={account.certified_email} />
          <DetailRow label="Website" value={account.website} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow
            label="Address"
            value={formatAddress([
              account.address,
              account.postal_code,
              account.city,
              account.province,
              account.country,
            ])}
          />
          <DetailRow label="Carrier" value={account.carrier} />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h4 className="text-lg font-semibold">Finance</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="VAT number" value={account.vat_number} />
          <DetailRow label="Tax code" value={account.tax_code} />
          <DetailRow label="IBAN" value={account.iban} />
          <DetailRow label="ABI" value={account.abi} />
          <DetailRow label="CAB" value={account.cab} />
          <DetailRow
            label="Legacy ID"
            value={account.legacy_id != null ? account.legacy_id : "—"}
          />
          <DetailRow label="CRM ID" value={account.crm_id} />
          <DetailRow label="Recipient code" value={account.recipient_code} />
        </div>
      </section>
    </div>
  );
}
