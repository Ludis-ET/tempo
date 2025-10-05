import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Globe2,
  RefreshCcw,
  UserCheck,
  Users,
} from "lucide-react";
import { useAccounts } from "@/modules/core/hooks/useAccounts";
import type { Account } from "@/modules/core/types";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } = useAccounts({
    page: 1,
    ordering: "-updated_at",
  });

  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const recentAccounts: Account[] = useMemo(
    () => data?.results.slice(0, 6) ?? [],
    [data?.results]
  );
  const activeOnPage = useMemo(
    () => recentAccounts.filter((account) => account.is_active).length,
    [recentAccounts]
  );
  const distinctCountries = useMemo(() => {
    const set = new Set<string>();
    recentAccounts.forEach((account) => {
      if (account.country) set.add(account.country);
    });
    return set.size;
  }, [recentAccounts]);
  const lastUpdated = recentAccounts[0]?.updated_at;

  const metricCards = [
    {
      label: "Customer accounts",
      value: data ? numberFormatter.format(data.count) : null,
      icon: Users,
      footnote: isFetching
        ? "Refreshing…"
        : "Total records managed in the system.",
    },
    {
      label: "Active (this page)",
      value: data ? `${activeOnPage}/${recentAccounts.length || 0}` : null,
      icon: UserCheck,
      footnote: "Snapshot of active customers in the latest results.",
    },
    {
      label: "Countries represented",
      value: data ? numberFormatter.format(distinctCountries) : null,
      icon: Globe2,
      footnote: "Unique billing countries in the latest accounts.",
    },
    {
      label: "Last update",
      value: lastUpdated
        ? dateFormatter.format(new Date(lastUpdated))
        : data
          ? "—"
          : null,
      icon: RefreshCcw,
      footnote: lastUpdated
        ? "Most recently updated customer."
        : "No accounts found yet.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">ERP Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor customer health, track recent updates, and jump into
            detailed workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh data
          </Button>
          <Button onClick={() => navigate("/customers")}>
            Manage accounts
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric, index) => (
          <Card key={metric.label} className="overflow-hidden">
            <CardContent className="flex items-center justify-between gap-3 py-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-6 w-24" />
                ) : (
                  <p className="mt-2 text-2xl font-semibold">
                    {metric.value ?? "—"}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {metric.footnote}
                </p>
              </div>
              <div
                className={cn(
                  "rounded-full p-3",
                  index === 0
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <metric.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recently updated accounts</CardTitle>
            <CardDescription>
              Latest customer changes synced from the core platform.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/customers")}
          >
            View all
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isError ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load accounts</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Please try again later."}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Account manager</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No accounts available yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {account.company_name}
                          </span>
                          {account.code ? (
                            <Badge variant="outline" className="text-xs">
                              {account.code}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {account.email ?? account.phone ?? "No contact info"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {account.account_manager_name ?? "Unassigned"}
                      </TableCell>
                      <TableCell>{account.country ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={account.is_active ? "default" : "outline"}
                          className={
                            account.is_active
                              ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                              : undefined
                          }
                        >
                          {account.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {account.updated_at
                          ? dateFormatter.format(new Date(account.updated_at))
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>
            Keep operations on track with the most used actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            title="Create new account"
            description="Register a customer profile with billing and shipping data."
            onClick={() => navigate("/customers")}
          />
          <QuickLink
            title="Review orders pipeline"
            description="Track fulfilment and ensure invoices are issued on time."
            onClick={() => navigate("/orders")}
          />
          <QuickLink
            title="Monitor inventory levels"
            description="Jump to stock movements and warehouse metrics."
            onClick={() => navigate("/inventory")}
          />
        </CardContent>
      </Card>
    </div>
  );
}

type QuickLinkProps = {
  title: string;
  description: string;
  onClick: () => void;
};

function QuickLink({ title, description, onClick }: QuickLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full flex-col justify-between rounded-lg border bg-background p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div>
        <p className="text-base font-semibold flex items-center gap-2">
          {title}
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
