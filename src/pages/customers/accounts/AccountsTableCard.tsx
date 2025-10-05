import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreHorizontal, Pencil, Eye, Trash } from "lucide-react";
import type { Account, AccountsListResponse } from "@/modules/core/types";

type AccountsTableCardProps = {
  data?: AccountsListResponse;
  isLoading: boolean;
  isFetching: boolean;
  primaryError: string | null;
  onCreate: () => void;
  createDisabled: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (account: Account) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
  };
  onPageChange: (page: number) => void;
  dateFormatter: Intl.DateTimeFormat;
};

export function AccountsTableCard({
  data,
  isLoading,
  isFetching,
  primaryError,
  onCreate,
  createDisabled,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  dateFormatter,
}: AccountsTableCardProps) {
  const hasData = Boolean(data && data.results.length > 0);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            {isFetching
              ? "Updating results…"
              : data
                ? `${data.count} accounts total`
                : "No data yet"}
          </CardDescription>
        </div>
        <Button onClick={onCreate} disabled={createDisabled}>
          <Plus className="mr-2 h-4 w-4" /> New account
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {primaryError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load accounts</AlertTitle>
            <AlertDescription>{primaryError}</AlertDescription>
          </Alert>
        ) : null}

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
                <TableHead className="w-[1%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={8}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : hasData && data ? (
                data.results.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="font-medium">{account.company_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {account.code}
                      </div>
                      {account.email ? (
                        <div className="text-xs text-muted-foreground">
                          {account.email}
                        </div>
                      ) : null}
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
                          {account.account_manager ? (
                            <div className="text-xs text-muted-foreground">
                              ID #{account.account_manager}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {account.payment_method_name ? (
                        <div className="space-y-0.5">
                          <div>{account.payment_method_name}</div>
                          {account.payment_method ? (
                            <div className="text-xs text-muted-foreground">
                              ID #{account.payment_method}
                            </div>
                          ) : null}
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault();
                              onView(account.id);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault();
                              onEdit(account.id);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(event) => {
                              event.preventDefault();
                              onDelete(account);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
            {data && hasData
              ? `Showing ${pagination.startIndex.toLocaleString()}-${pagination.endIndex.toLocaleString()} of ${data.count.toLocaleString()}`
              : "No results"}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onPageChange(Math.max(1, pagination.currentPage - 1))
              }
              disabled={pagination.currentPage === 1 || isFetching}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onPageChange(
                  Math.min(pagination.totalPages, pagination.currentPage + 1)
                )
              }
              disabled={
                pagination.currentPage >= pagination.totalPages || isFetching
              }
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
