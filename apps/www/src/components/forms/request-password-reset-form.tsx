import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ShowToast } from "../toast-notification";
import { rpc } from "@/features/api-client";
import { authClient } from "@/features/auth";
import { FormFieldError } from "./components/form-field-error";
import { SubLogo } from "../logo";

export const emailVerificationSchema = z.object({
  email: z.email({ message: "Recipient email is invalid" }),
});

export default function RequestPasswordResetForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: emailVerificationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setLoading(true);

        const isEmailExisting = await rpc.api.users.email[":id"].$get({
          param: { id: value.email },
        });

        if (!isEmailExisting.ok) throw new Error("Email does not exist.");

        const { error } = await authClient.requestPasswordReset({
          email: value.email,
          redirectTo: window.location.origin + "/reset-password",
        });

        if (error) throw new Error(error.message);

        formApi.reset();
        ShowToast("success", "Verification link sent to your email.");
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
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-3 mb-4">
        <SubLogo />
        <p className="text-4xl">Email Verification</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p>Email</p>
          <form.Field name="email">
            {(field) => (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                  disabled={loading}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Verify"}
      </Button>
    </form>
  );
}
