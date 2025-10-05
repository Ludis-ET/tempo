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
import type {
  AccountsOrderOption,
  FilterFormState,
  FilterSelectOption,
} from "./types";
import type { AccountsFiltersHandlers } from "./types";

type AccountsFiltersCardProps = {
  formState: FilterFormState;
  accountManagerOptions: FilterSelectOption[];
  countryOptions: string[];
  paymentMethodOptions: FilterSelectOption[];
  orderOptions: AccountsOrderOption[];
  isFetching: boolean;
  isLoading: boolean;
  handlers: AccountsFiltersHandlers;
};

export function AccountsFiltersCard({
  formState,
  accountManagerOptions,
  countryOptions,
  paymentMethodOptions,
  orderOptions,
  isFetching,
  isLoading,
  handlers,
}: AccountsFiltersCardProps) {
  return (
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
          onSubmit={handlers.onSubmit}
        >
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name, code, email…"
              value={formState.search}
              onChange={handlers.onInputChange("search")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formState.country}
              onValueChange={handlers.onSelectChange("country")}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
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
              onValueChange={handlers.onSelectChange("accountManager")}
            >
              <SelectTrigger id="accountManager">
                <SelectValue placeholder="All managers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All managers</SelectItem>
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
              onValueChange={handlers.onSelectChange("paymentMethod")}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
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
              onValueChange={handlers.onSelectChange("isActive")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Active & inactive" />
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
              onValueChange={handlers.onSelectChange("ordering")}
            >
              <SelectTrigger id="ordering">
                <SelectValue placeholder="Ordering" />
              </SelectTrigger>
              <SelectContent>
                {orderOptions.map((option) => (
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
              onClick={handlers.onReset}
              disabled={isFetching && isLoading}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handlers.onRefresh}
              disabled={isFetching}
            >
              Refresh
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
