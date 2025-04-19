import { Button } from "@/components/ui/button";
import { FormField, FormFooter, FormHeader } from "@/components/ui/form";
import { getFieldError } from "@/lib/utils";
import type { verificationSchema } from "@/lib/validations.server";
import { Loader2, Mail } from "lucide-react";
import { Form } from "react-router";
import type { z } from "zod";

type VerificationErrors = z.inferFlattenedErrors<
  typeof verificationSchema
>["fieldErrors"];

export default function VerificationForm({
  errors,
  isSubmitting,
}: {
  errors?: VerificationErrors;
  isSubmitting: boolean;
}) {
  return (
    <Form method="post" className="flex flex-col gap-6 w-md">
      <FormHeader
        title="Email Verification"
        description="Enter your email to receive a verification link."
      />
      <div className="grid gap-6">
        <FormField
          id="email"
          name="email"
          type="text"
          label="Email"
          placeholder="email@example.com"
          error={getFieldError(errors, "email")}
        />
        <Button
          type="submit"
          className="w-full h-12 p-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Send Verification Link
        </Button>
      </div>
      <FormFooter
        message="Already verified your email?"
        linkText="Login"
        href="/login"
      />
    </Form>
  );
}
