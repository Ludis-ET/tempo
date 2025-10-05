import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from "@/modules/core/components/AccountForm";
import type { AccountPayload } from "@/modules/core/types";

type AccountCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AccountPayload) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
};

export function AccountCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage,
}: AccountCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create customer account</DialogTitle>
          <DialogDescription>
            Capture the core details to register a new customer account.
          </DialogDescription>
        </DialogHeader>
        <AccountForm
          submitLabel="Create account"
          onSubmit={(payload) => onSubmit(payload)}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  );
}
