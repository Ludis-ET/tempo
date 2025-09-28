import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { SubmitButton } from "@/modules/auth/components/SubmitButton";
import { useChangePassword } from "@/modules/auth/hooks/useAuth";
import { toast } from "sonner";

const schema = z
  .object({
    old_password: z.string().min(8),
    new_password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((d) => d.new_password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const { mutateAsync, isPending } = useChangePassword();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync({ old_password: values.old_password, new_password: values.new_password });
    toast.success("Password changed successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField label="Current password" type="password" {...register("old_password")} error={errors.old_password?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="New password" type="password" {...register("new_password")} error={errors.new_password?.message} />
            <InputField label="Confirm new password" type="password" {...register("confirm")} error={errors.confirm?.message} />
          </div>
          <SubmitButton loading={isPending}>Update password</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
