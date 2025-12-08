import { cn } from "@binspire/ui/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

interface InputProps extends React.ComponentProps<"input"> {
  field?: AnyFieldApi;
}

function Input({ className, type, field, ...props }: InputProps) {
  const hasError = (field?.state?.meta?.errors?.length ?? 0) > 0;

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-transparent p-4 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        hasError ? "border-destructive" : "",
        className,
      )}
      {...props}
    />
  );
}

function PasswordInput({ className, field, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const hasError = (field?.state?.meta?.errors?.length ?? 0) > 0;

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className={cn(
          "file:text-foreground font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-transparent p-4 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          hasError ? "border-destructive" : "",
          "pr-10",
          className,
        )}
        {...props}
      />

      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export { Input, PasswordInput };
