import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { rpc } from "@/features/api-client";
import { SubLogo } from "../logo";
import { ShowToast } from "../toast-notification";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormFieldError } from "./components/form-field-error";

export const emailVerificationSchema = z.object({
  email: z.email({ message: "Recipient email is invalid" }),
});

export default function RequestDemoForm() {
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

        const requestDemo = await rpc.api.emails["send-request-demo"].$post({
          json: { email: value.email },
        });

        if (!requestDemo.ok) throw new Error("Failed to request demo");

        formApi.reset();
        ShowToast("success", "Request Sucessful. We will contact you soon.");
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
        <p className="text-4xl">Request Demo</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p>Email</p>
          <form.Field name="email">
            {(field) => (
              <>
                <Input
                  type="email"
                  placeholder="Enter your organization email"
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
        {loading ? <Loader2 className="animate-spin" /> : "Request"}
      </Button>
    </form>
  );
}
