import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/modules/core/hooks/useAccounts";
import type { AccountsListQuery } from "@/modules/core/types";
import { getPrimaryErrorMessage } from "@/lib/api-error";

const ORDER_OPTIONS: { label: string; value: string }[] = [
  { label: "Name (A → Z)", value: "company_name" },
  { label: "Name (Z → A)", value: "-company_name" },
  { label: "Newest", value: "-created_at" },
  { label: "Oldest", value: "created_at" },
  { label: "Recently updated", value: "-updated_at" },
  { label: "Least recently updated", value: "updated_at" },
];

type FilterFormState = {
  search: string;
  accountManager: string;
  country: string;
  paymentMethod: string;
  isActive: "all" | "true" | "false";
  ordering: string;
};

const DEFAULT_FORM: FilterFormState = {
  search: "",
  accountManager: "",
  country: "",
  paymentMethod: "",
  isActive: "all",
  ordering: "company_name",
};

const DEFAULT_QUERY: AccountsListQuery = {
  page: 1,
  ordering: "company_name",
};

export default function AccountsListPage() {
  const [formState, setFormState] = useState<FilterFormState>(DEFAULT_FORM);
  const [query, setQuery] = useState<AccountsListQuery>(DEFAULT_QUERY);

  const { data, isLoading, isFetching, error, refetch } = useAccounts(query);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    data?.results.forEach((account) => {
      if (account.country) set.add(account.country);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data?.results]);

  const accountManagerOptions = useMemo(() => {
    const map = new Map<number, string>();
    data?.results.forEach((account) => {
      if (account.account_manager && account.account_manager_name) {
        map.set(account.account_manager, account.account_manager_name);
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value: String(value), label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data?.results]);

  const paymentMethodOptions = useMemo(() => {
    const map = new Map<number, string>();
    data?.results.forEach((account) => {
      if (account.payment_method && account.payment_method_name) {
        map.set(account.payment_method, account.payment_method_name);
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value: String(value), label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data?.results]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const currentPage = query.page ?? 1;
  const pageSize = data?.results?.length ?? 0;
  const totalPages = useMemo(() => {
    if (!data || pageSize === 0) return currentPage;
    return Math.max(1, Math.ceil(data.count / pageSize));
  }, [data, currentPage, pageSize]);

  const handleInputChange =
    (key: keyof FilterFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSelectChange =
    (key: keyof FilterFormState) => (value: string) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    };

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: AccountsListQuery = {
      page: 1,
      ordering: formState.ordering || undefined,
      search: formState.search.trim() || undefined,
      country: formState.country.trim() || undefined,
      account_manager: formState.accountManager.trim()
        ? Number(formState.accountManager.trim())
        : undefined,
      payment_method: formState.paymentMethod.trim()
        ? Number(formState.paymentMethod.trim())
        : undefined,
      is_active:
        formState.isActive === "all"
          ? undefined
          : formState.isActive === "true",
    };

    if (
      typeof next.account_manager === "number" &&
      Number.isNaN(next.account_manager)
    ) {
      delete next.account_manager;
    }
    if (
      typeof next.payment_method === "number" &&
      Number.isNaN(next.payment_method)
    ) {
      delete next.payment_method;
    }

    setQuery(next);
  };

  const resetFilters = () => {
    setFormState(DEFAULT_FORM);
    setQuery(DEFAULT_QUERY);
  };

  const changePage = (nextPage: number) => {
    setQuery((prev) => ({
      ...prev,
      page: nextPage,
    }));
  };

  const startIndex = useMemo(() => {
    if (!data || pageSize === 0) return 0;
    return (currentPage - 1) * pageSize + 1;
  }, [data, currentPage, pageSize]);

  const endIndex = useMemo(() => {
    if (!data || pageSize === 0) return 0;
    return (currentPage - 1) * pageSize + data.results.length;
  }, [data, currentPage, pageSize]);

  const primaryError = error ? getPrimaryErrorMessage(error) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Customer Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Browse customer accounts with quick filtering for account managers,
          countries, and status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine the results using the controls below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            onSubmit={applyFilters}
          >
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, code, email…"
                value={formState.search}
                onChange={handleInputChange("search")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formState.country}
                onValueChange={handleSelectChange("country")}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All countries</SelectItem>
                  {countryOptions.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountManager">Account manager</Label>
              <Select
                value={formState.accountManager}
                onValueChange={handleSelectChange("accountManager")}
              >
                <SelectTrigger id="accountManager">
                  <SelectValue placeholder="All managers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All managers</SelectItem>
                  {accountManagerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment method</Label>
              <Select
                value={formState.paymentMethod}
                onValueChange={handleSelectChange("paymentMethod")}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All methods</SelectItem>
                  {paymentMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formState.isActive}
                onValueChange={handleSelectChange("isActive")}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Active & inactive</SelectItem>
                  <SelectItem value="true">Active only</SelectItem>
                  <SelectItem value="false">Inactive only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordering">Order by</Label>
              <Select
                value={formState.ordering}
                onValueChange={handleSelectChange("ordering")}
              >
                <SelectTrigger id="ordering">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={isFetching}>
                Apply filters
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                disabled={isFetching && isLoading}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                Refresh
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            {isFetching
              ? "Updating results…"
              : data
                ? `${data.count} accounts total`
                : "No data yet"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {primaryError && (
            <Alert variant="destructive">
              <AlertTitle>Unable to load accounts</AlertTitle>
              <AlertDescription>{primaryError}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Account manager</TableHead>
                  <TableHead>Payment method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipping addresses</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data && data.results.length > 0 ? (
                  data.results.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="font-medium">
                          {account.company_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {account.code}
                        </div>
                        {account.email && (
                          <div className="text-xs text-muted-foreground">
                            {account.email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{account.country ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {[account.city, account.province]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {account.account_manager_name ? (
                          <div className="space-y-0.5">
                            <div>{account.account_manager_name}</div>
                            {account.account_manager && (
                              <div className="text-xs text-muted-foreground">
                                ID #{account.account_manager}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.payment_method_name ? (
                          <div className="space-y-0.5">
                            <div>{account.payment_method_name}</div>
                            {account.payment_method && (
                              <div className="text-xs text-muted-foreground">
                                ID #{account.payment_method}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={account.is_active ? "default" : "secondary"}
                        >
                          {account.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {account.shipping_addresses?.length ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {account.updated_at
                          ? dateFormatter.format(new Date(account.updated_at))
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No accounts found. Adjust your filters and try again.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {data && pageSize > 0
                ? `Showing ${startIndex.toLocaleString()}-${endIndex.toLocaleString()} of ${data.count.toLocaleString()}`
                : "No results"}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isFetching}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  changePage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
