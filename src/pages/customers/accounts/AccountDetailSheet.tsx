import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { AccountOverview } from "@/modules/core/components/AccountOverview";
import {
  AccountForm,
  type AccountFormValues,
} from "@/modules/core/components/AccountForm";
import type { Account, AccountPayload } from "@/modules/core/types";
import type { DetailTab } from "./types";
import { AccountShippingAddresses } from "./AccountShippingAddresses";

type AccountDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  detailData: Account | null;
  isLoading: boolean;
  detailError: string | null;
  editInitialValues?: AccountFormValues;
  onSubmit: (payload: AccountPayload) => Promise<void> | void;
  onDeleteRequest: (account: Account) => void;
  isUpdating: boolean;
  updateError: string | null;
  dateFormatter: Intl.DateTimeFormat;
};

export function AccountDetailSheet({
  open,
  onOpenChange,
  tab,
  onTabChange,
  detailData,
  isLoading,
  detailError,
  editInitialValues,
  onSubmit,
  onDeleteRequest,
  isUpdating,
  updateError,
  dateFormatter,
}: AccountDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Account details</SheetTitle>
          <SheetDescription>
            Review master data, shipping addresses, and financial settings.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-3 py-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>
        ) : detailData ? (
          <>
            <Tabs
              value={tab}
              onValueChange={(value) => {
                onTabChange(value as DetailTab);
              }}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <AccountOverview account={detailData} />
                <AccountShippingAddresses
                  accountId={detailData.id}
                  enabled={open && tab === "overview"}
                />
              </TabsContent>
              <TabsContent value="edit" className="space-y-4">
                <AccountForm
                  initialValues={editInitialValues}
                  submitLabel="Save changes"
                  onSubmit={(payload) => onSubmit(payload)}
                  onCancel={() => onTabChange("overview")}
                  isSubmitting={isUpdating}
                  errorMessage={updateError}
                />
              </TabsContent>
            </Tabs>

            <SheetFooter className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Created
                {detailData.created_at
                  ? ` ${dateFormatter.format(new Date(detailData.created_at))}`
                  : " —"}
              </div>
              <Button
                variant="destructive"
                onClick={() => onDeleteRequest(detailData)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete account
              </Button>
            </SheetFooter>
          </>
        ) : (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Unable to load account</AlertTitle>
            <AlertDescription>
              {detailError ?? "Account could not be found. Try again later."}
            </AlertDescription>
          </Alert>
        )}
      </SheetContent>
    </Sheet>
  );
}
