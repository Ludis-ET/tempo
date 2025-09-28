import React, { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export type InputFieldProps = {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  type?: React.ComponentProps<typeof Input>["type"];
} & Omit<React.ComponentProps<typeof Input>, "type">;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, description, error, success, type = "text", className, id, ...props }, ref) => {
    const internalId = useId();
    const inputId = id ?? internalId;
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium leading-none">
            {label}
          </label>
        )}
        <div className="relative">
          <Input
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={description ? `${inputId}-desc` : undefined}
            type={isPassword ? (show ? "text" : "password") : type}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
              success && !error && "border-success focus-visible:ring-success",
              className,
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <Button type="button" variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
        {description && (
          <p id={`${inputId}-desc`} className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
        {success && !error && <p className="text-xs text-success">{success}</p>}
      </div>
    );
  },
);
InputField.displayName = "InputField";

export default InputField;
