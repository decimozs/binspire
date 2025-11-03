import { authClient } from "@/features/auth";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";
import { ShowToast } from "../toast-notification";
import { PasswordInput } from "../ui/input";
import { FormFieldError } from "./components/form-field-error";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { SubLogo } from "../logo";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ResetPasswordForm({ token }: { token: string }) {
  const [isLoading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setLoading(true);

        const { error } = await authClient.resetPassword({
          newPassword: value.password,
          token,
        });

        if (error) {
          throw new Error(error.message);
        }

        setTimeout(() => {
          window.location.href =
            import.meta.env.VITE_NODE_ENV === "development"
              ? "http://localhost:5174/"
              : "https://arcovia.binspire.space/";
        }, 1000);

        ShowToast("success", "Password reset successfully.");
        formApi.reset();
      } catch (err) {
        const error = err as Error;
        ShowToast(
          "error",
          error.message || "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="grid grid-cols-1 gap-4 w-screen px-4 md:w-md"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-3 mb-4">
        <SubLogo />
        <p className="text-4xl">Reset Password</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p>New password</p>
          <form.Field name="password">
            {(field) => (
              <>
                <PasswordInput
                  placeholder="Enter your password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col gap-2">
          <p>Confirm password</p>
          <form.Field name="confirmPassword">
            {(field) => (
              <>
                <PasswordInput
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Reset"}
      </Button>
    </form>
  );
}
