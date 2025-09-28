import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/ui/input-field";
import AuthLayout from "@/components/layout/AuthLayout";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SubmitButton } from "@/modules/auth/components/SubmitButton";

const schema = z.object({ email: z.string().email() });

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors }, } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_: FormValues) => {
    toast.error("Password reset endpoint is not provided. Please configure when available.");
  };

  return (
    <AuthLayout title="Reset password" description="We'll send a reset link to your email.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
        <SubmitButton className="w-full">Send reset link</SubmitButton>
        <div className="text-sm text-center">
          <Link to="/auth/login" className="text-primary underline-offset-4 hover:underline">Back to sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
