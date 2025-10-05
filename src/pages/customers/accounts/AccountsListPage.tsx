import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { useAccounts } from "@/modules/core/hooks/useAccounts";
import { useAccount } from "@/modules/core/hooks/useAccount";
import {
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "@/modules/core/hooks/useAccountMutations";
import {
  accountToFormValues,
  type AccountFormValues,
} from "@/modules/core/components/AccountForm";
import type {
  Account,
  AccountPayload,
  AccountsListQuery,
} from "@/modules/core/types";
import { getPrimaryErrorMessage } from "@/lib/api-error";
import { AccountsFiltersCard } from "./AccountsFiltersCard";
import { AccountsTableCard } from "./AccountsTableCard";
import { AccountCreateDialog } from "./AccountCreateDialog";
import { AccountDetailSheet } from "./AccountDetailSheet";
import { AccountDeleteDialog } from "./AccountDeleteDialog";
import { ORDER_OPTIONS } from "./constants";
import type {
  AccountsFiltersHandlers,
  DetailTab,
  FilterFormState,
  FilterSelectOption,
} from "./types";

const DEFAULT_FORM: FilterFormState = {
  search: "",
  accountManager: "all",
  country: "all",
  paymentMethod: "all",
  isActive: "all",
  ordering: "company_name",
};

const DEFAULT_QUERY: AccountsListQuery = {
  page: 1,
  ordering: "company_name",
};

export function AccountsListPage() {
  const [formState, setFormState] = useState<FilterFormState>(DEFAULT_FORM);
  const [query, setQuery] = useState<AccountsListQuery>(DEFAULT_QUERY);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useAccounts(query);
  const detailQuery = useAccount(selectedAccountId, { enabled: detailOpen });
  const {
    data: detailData,
    isLoading: isDetailLoading,
    error: detailErrorObj,
  } = detailQuery;

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    data?.results.forEach((account) => {
      if (account.country) set.add(account.country);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data?.results]);

  const accountManagerOptions = useMemo<FilterSelectOption[]>(() => {
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

  const paymentMethodOptions = useMemo<FilterSelectOption[]>(() => {
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
    (key: keyof FilterFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSelectChange =
    (key: keyof FilterFormState) => (value: string) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: AccountsListQuery = {
      page: 1,
      ordering: formState.ordering || undefined,
      search: formState.search.trim() || undefined,
      country:
        formState.country === "all"
          ? undefined
          : formState.country.trim() || undefined,
      account_manager:
        formState.accountManager === "all"
          ? undefined
          : formState.accountManager.trim()
            ? Number(formState.accountManager.trim())
            : undefined,
      payment_method:
        formState.paymentMethod === "all"
          ? undefined
          : formState.paymentMethod.trim()
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

  const handleRefresh = () => {
    void refetch();
  };

  const changePage = (nextPage: number) => {
    setQuery((prev) => ({
      ...prev,
      page: nextPage,
    }));
  };

  const openCreateDialog = () => {
    setCreateError(null);
    setCreateOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateOpen(false);
    setCreateError(null);
  };

  const handleCreateOpenChange = (open: boolean) => {
    if (!open) {
      closeCreateDialog();
    } else {
      setCreateOpen(true);
    }
  };

  const openDetail = (id: number, tab: DetailTab = "overview") => {
    setSelectedAccountId(id);
    setDetailTab(tab);
    setUpdateError(null);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedAccountId(null);
    setDetailTab("overview");
    setUpdateError(null);
  };

  const handleDetailOpenChange = (open: boolean) => {
    if (!open) {
      closeDetail();
    } else if (selectedAccountId) {
      setDetailOpen(true);
    }
  };

  const handleDetailTabChange = (value: DetailTab) => {
    setDetailTab(value);
    if (value === "overview") {
      setUpdateError(null);
    }
  };

  const handleCreateSubmit = async (payload: AccountPayload) => {
    setCreateError(null);
    try {
      const created = await createAccount.mutateAsync(payload);
      toast.success(`Account ${created.company_name} created`);
      closeCreateDialog();
    } catch (err) {
      setCreateError(getPrimaryErrorMessage(err) ?? "Unable to create account");
    }
  };

  const handleUpdateSubmit = async (payload: AccountPayload) => {
    if (!selectedAccountId) return;
    setUpdateError(null);
    try {
      const updated = await updateAccount.mutateAsync({
        id: selectedAccountId,
        payload,
      });
      toast.success(`Account ${updated.company_name} updated`);
      setDetailTab("overview");
    } catch (err) {
      setUpdateError(getPrimaryErrorMessage(err) ?? "Unable to update account");
    }
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    setDeleteError(null);
    try {
      await deleteAccount.mutateAsync({ id: accountToDelete.id });
      toast.success(`Account ${accountToDelete.company_name} deleted`);
      if (selectedAccountId === accountToDelete.id) {
        closeDetail();
      }
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (err) {
      setDeleteError(getPrimaryErrorMessage(err) ?? "Unable to delete account");
    }
  };

  const startIndex = useMemo(() => {
    if (!data || pageSize === 0) return 0;
    return (currentPage - 1) * pageSize + 1;
  }, [data, currentPage, pageSize]);

  const endIndex = useMemo(() => {
    if (!data || pageSize === 0) return 0;
    return (currentPage - 1) * pageSize + (data?.results.length ?? 0);
  }, [data, currentPage, pageSize]);

  const primaryError = error ? getPrimaryErrorMessage(error) : null;
  const detailError = detailErrorObj
    ? getPrimaryErrorMessage(detailErrorObj)
    : null;

  const editInitialValues = useMemo<AccountFormValues | undefined>(() => {
    if (!detailData) return undefined;
    return accountToFormValues(detailData);
  }, [detailData]);

  const filterHandlers: AccountsFiltersHandlers = {
    onInputChange: handleInputChange,
    onSelectChange: handleSelectChange,
    onSubmit: applyFilters,
    onReset: resetFilters,
    onRefresh: handleRefresh,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Customer Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Browse customer accounts with quick filtering and full CRUD controls.
        </p>
      </div>

      <AccountsFiltersCard
        formState={formState}
        accountManagerOptions={accountManagerOptions}
        countryOptions={countryOptions}
        paymentMethodOptions={paymentMethodOptions}
        orderOptions={ORDER_OPTIONS}
        isFetching={isFetching}
        isLoading={isLoading}
        handlers={filterHandlers}
      />

      <AccountsTableCard
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        primaryError={primaryError}
        onCreate={openCreateDialog}
        createDisabled={createAccount.isPending}
        onView={(id) => openDetail(id, "overview")}
        onEdit={(id) => openDetail(id, "edit")}
        onDelete={(account) => {
          setAccountToDelete(account);
          setDeleteError(null);
          setDeleteDialogOpen(true);
        }}
        pagination={{
          currentPage,
          totalPages,
          startIndex,
          endIndex,
        }}
        onPageChange={changePage}
        dateFormatter={dateFormatter}
      />

      <AccountCreateDialog
        open={isCreateOpen}
        onOpenChange={handleCreateOpenChange}
        onSubmit={handleCreateSubmit}
        onCancel={closeCreateDialog}
        isSubmitting={createAccount.isPending}
        errorMessage={createError}
      />

      <AccountDetailSheet
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        tab={detailTab}
        onTabChange={handleDetailTabChange}
        detailData={detailData ?? null}
        isLoading={isDetailLoading}
        detailError={detailError}
        editInitialValues={editInitialValues}
        onSubmit={handleUpdateSubmit}
        onDeleteRequest={(account) => {
          setAccountToDelete(account);
          setDeleteError(null);
          setDeleteDialogOpen(true);
        }}
        isUpdating={updateAccount.isPending}
        updateError={updateError}
        dateFormatter={dateFormatter}
      />

      <AccountDeleteDialog
        open={deleteDialogOpen}
        account={accountToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen(false);
            setAccountToDelete(null);
            setDeleteError(null);
          } else if (accountToDelete) {
            setDeleteDialogOpen(true);
          }
        }}
        onConfirm={() => {
          void handleDeleteAccount();
        }}
        isPending={deleteAccount.isPending}
        errorMessage={deleteError}
      />
    </div>
  );
}
