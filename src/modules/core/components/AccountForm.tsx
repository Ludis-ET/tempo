import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Account, AccountPayload } from "../types";

type OptionalStringSchema = z.ZodEffects<z.ZodString, string, string>;

type AccountFormProps = {
  initialValues?: AccountFormValues;
  submitLabel: string;
  onSubmit: (
    payload: AccountPayload,
    values: AccountFormValues
  ) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

const optionalString = (): OptionalStringSchema =>
  z.string().transform((value) => value.trim());

const optionalEmail = () =>
  optionalString().superRefine((value, ctx) => {
    if (!value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid email",
      });
    }
  });

const optionalUrl = () =>
  optionalString().superRefine((value, ctx) => {
    if (!value) return;
    try {
      new URL(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid URL",
      });
    }
  });

const optionalNumericId = () =>
  optionalString().superRefine((value, ctx) => {
    if (!value) return;
    if (!/^\d+$/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a whole number",
      });
    }
  });

const accountFormSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  vat_number: optionalString(),
  tax_code: optionalString(),
  address: optionalString(),
  city: optionalString(),
  province: optionalString(),
  postal_code: optionalString(),
  country: optionalString(),
  email: optionalEmail(),
  phone: optionalString(),
  website: optionalUrl(),
  abi: optionalString(),
  cab: optionalString(),
  iban: optionalString(),
  recipient_code: optionalString(),
  certified_email: optionalEmail(),
  notes: optionalString(),
  is_active: z.boolean(),
  legacy_id: optionalNumericId(),
  crm_id: optionalString(),
  account_manager: optionalNumericId(),
  payment_method: optionalNumericId(),
  carrier: optionalString(),
  vat_rate: optionalNumericId(),
  shipping_address: optionalNumericId(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const accountFormDefaultValues: AccountFormValues = {
  company_name: "",
  vat_number: "",
  tax_code: "",
  address: "",
  city: "",
  province: "",
  postal_code: "",
  country: "",
  email: "",
  phone: "",
  website: "",
  abi: "",
  cab: "",
  iban: "",
  recipient_code: "",
  certified_email: "",
  notes: "",
  is_active: true,
  legacy_id: "",
  crm_id: "",
  account_manager: "",
  payment_method: "",
  carrier: "",
  vat_rate: "",
  shipping_address: "",
};

function resolveInitialValues(values?: AccountFormValues): AccountFormValues {
  return values ? { ...values } : { ...accountFormDefaultValues };
}

export function accountToFormValues(account: Account): AccountFormValues {
  return {
    company_name: account.company_name ?? "",
    vat_number: account.vat_number ?? "",
    tax_code: account.tax_code ?? "",
    address: account.address ?? "",
    city: account.city ?? "",
    province: account.province ?? "",
    postal_code: account.postal_code ?? "",
    country: account.country ?? "",
    email: account.email ?? "",
    phone: account.phone ?? "",
    website: account.website ?? "",
    abi: account.abi ?? "",
    cab: account.cab ?? "",
    iban: account.iban ?? "",
    recipient_code: account.recipient_code ?? "",
    certified_email: account.certified_email ?? "",
    notes: account.notes ?? "",
    is_active: account.is_active,
    legacy_id: account.legacy_id != null ? String(account.legacy_id) : "",
    crm_id: account.crm_id ?? "",
    account_manager:
      account.account_manager != null ? String(account.account_manager) : "",
    payment_method:
      account.payment_method != null ? String(account.payment_method) : "",
    carrier: account.carrier ?? "",
    vat_rate: account.vat_rate != null ? String(account.vat_rate) : "",
    shipping_address:
      account.shipping_address != null ? String(account.shipping_address) : "",
  };
}

function toNullableString(value: string): string | null {
  return value ? value : null;
}

function toOptionalNumber(value: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formValuesToPayload(values: AccountFormValues): AccountPayload {
  return {
    company_name: values.company_name,
    vat_number: toNullableString(values.vat_number),
    tax_code: toNullableString(values.tax_code),
    address: toNullableString(values.address),
    city: toNullableString(values.city),
    province: toNullableString(values.province),
    postal_code: toNullableString(values.postal_code),
    country: toNullableString(values.country),
    email: toNullableString(values.email),
    phone: toNullableString(values.phone),
    website: toNullableString(values.website),
    abi: toNullableString(values.abi),
    cab: toNullableString(values.cab),
    iban: toNullableString(values.iban),
    recipient_code: toNullableString(values.recipient_code),
    certified_email: toNullableString(values.certified_email),
    notes: toNullableString(values.notes),
    is_active: values.is_active,
    legacy_id: toOptionalNumber(values.legacy_id),
    crm_id: toNullableString(values.crm_id),
    account_manager: toOptionalNumber(values.account_manager),
    payment_method: toOptionalNumber(values.payment_method),
    carrier: toNullableString(values.carrier),
    vat_rate: toOptionalNumber(values.vat_rate),
    shipping_address: toOptionalNumber(values.shipping_address),
  };
}

export function AccountForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
}: AccountFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: resolveInitialValues(initialValues),
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset(resolveInitialValues(initialValues));
    setCurrentStep(0);
  }, [form, initialValues]);

  const handleCancel = () => {
    form.reset(resolveInitialValues(initialValues));
    setCurrentStep(0);
    onCancel?.();
  };

  const submitHandler = form.handleSubmit(async (values) => {
    const payload = formValuesToPayload(values);
    await onSubmit(payload, values);
  });

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vat_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT number</FormLabel>
                  <FormControl>
                    <Input placeholder="IT1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax code</FormLabel>
                  <FormControl>
                    <Input placeholder="TAXCODE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crm_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRM ID</FormLabel>
                  <FormControl>
                    <Input placeholder="CRM-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Contact Details",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="billing@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+39 02 1234 567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certified_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certified email</FormLabel>
                  <FormControl>
                    <Input placeholder="pec@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Address",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Via Roma 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Milan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input placeholder="MI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input placeholder="20100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Italy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Banking Information",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="abi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ABI</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cab"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAB</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="IT60X0542811101000000123456"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient code</FormLabel>
                  <FormControl>
                    <Input placeholder="REC123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Additional Details",
      content: (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Whether this account is active and can be used.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legacy_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legacy ID</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account manager</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment method</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carrier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrier</FormLabel>
                  <FormControl>
                    <Input placeholder="DHL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vat_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT rate</FormLabel>
                  <FormControl>
                    <Input placeholder="22" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping address</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
  ];

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={submitHandler} className="space-y-6">
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to save account</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-4">
          <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
          <div className="flex space-x-1 mt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {steps[currentStep].content}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <div className="flex space-x-2">
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
            {isLastStep ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
