import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/ui/input-field";
import AuthLayout from "@/components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SubmitButton } from "@/modules/auth/components/SubmitButton";
import { ErrorText } from "@/modules/auth/components/ErrorText";
import { useRegister } from "@/modules/auth/hooks/useAuth";

const schema = z
  .object({
    username: z.string().min(2),
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    password: z.string().min(8),
    password_confirm: z.string().min(8),
    employee_id: z.string().min(1),
    department: z.string().min(1),
    position: z.string().min(1),
    phone: z.string().min(4),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync(values as any);
      toast.success("Account created");
      navigate("/");
    } catch (e: any) {
      toast.error(e?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      description="Start using LFPERP in minutes."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Username"
          placeholder="john_doe"
          error={errors.username?.message}
          {...register("username")}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            label="First name"
            placeholder="John"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <InputField
            label="Last name"
            placeholder="Doe"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <InputField
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.password_confirm?.message}
            {...register("password_confirm")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            label="Employee ID"
            placeholder="EMP001"
            error={errors.employee_id?.message}
            {...register("employee_id")}
          />
          <InputField
            label="Department"
            placeholder="IT"
            error={errors.department?.message}
            {...register("department")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            label="Position"
            placeholder="Developer"
            error={errors.position?.message}
            {...register("position")}
          />
          <InputField
            label="Phone"
            placeholder="+1234567890"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
        <ErrorText message={(error as Error)?.message} />
        <SubmitButton className="w-full" loading={isPending}>
          Create account
        </SubmitButton>
        <div className="text-sm text-center">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            to="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
