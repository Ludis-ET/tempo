import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { SubmitButton } from "@/modules/auth/components/SubmitButton";
import { useProfile, useUpdateProfile } from "@/modules/auth/hooks/useAuth";
import { ErrorText } from "@/modules/auth/components/ErrorText";
import { useEffect } from "react";

const schema = z.object({
  first_name: z.string().min(1, "Required").optional().or(z.literal("")),
  last_name: z.string().min(1, "Required").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  employee_id: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { data, isLoading, error } = useProfile();
  const { mutateAsync, isPending, error: updateError } = useUpdateProfile();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  useEffect(() => {
    if (data) {
      reset({
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        phone: data.phone ?? "",
        employee_id: data.employee_id ?? "",
        department: data.department ?? "",
        position: data.position ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values);
  };

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading profile…</div>;
  if (error) return <ErrorText message={(error as Error)?.message} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="First name" {...register("first_name")} error={errors.first_name?.message} />
            <InputField label="Last name" {...register("last_name")} error={errors.last_name?.message} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Phone" {...register("phone")} error={errors.phone?.message} />
            <InputField label="Employee ID" {...register("employee_id")} error={errors.employee_id?.message} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Department" {...register("department")} error={errors.department?.message} />
            <InputField label="Position" {...register("position")} error={errors.position?.message} />
          </div>
          <ErrorText message={(updateError as Error)?.message} />
          <SubmitButton loading={isPending}>Save changes</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
