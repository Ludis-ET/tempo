import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/ui/input-field";
import AuthLayout from "@/components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SubmitButton } from "@/modules/auth/components/SubmitButton";
import { ErrorText } from "@/modules/auth/components/ErrorText";
import { useLogin } from "@/modules/auth/hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await mutateAsync(data);
      toast.success("Signed in");
      navigate("/");
    } catch (e: any) {
      toast.error(e?.message || "Sign in failed");
    }
  };

  return (
    <AuthLayout title="Sign in" description="Access your NovaERP account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <InputField label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
        <div className="flex items-center justify-between text-sm">
          <Link to="/auth/forgot" className="text-primary underline-offset-4 hover:underline">Forgot password?</Link>
          <div>
            <span className="text-muted-foreground">No account? </span>
            <Link to="/auth/register" className="text-primary underline-offset-4 hover:underline">Create one</Link>
          </div>
        </div>
        <ErrorText message={(error as Error)?.message} />
        <SubmitButton className="w-full" loading={isPending}>Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}
