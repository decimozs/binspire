import { Button } from "@/components/ui/button";
import { FormField, FormFooter, FormHeader } from "@/components/ui/form";
import { getFieldError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Form, useNavigation } from "react-router";
import { Lock } from "lucide-react";
import type { FormProps } from "@/lib/types";
import type { resetPasswordSchema } from "@/lib/validations.server";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ResetPasswordFormProps = FormProps<typeof resetPasswordSchema>;

export default function ResetPasswordForm({
  actionSuccess,
  actionErrors,
}: ResetPasswordFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (
      !isSubmitting &&
      hasSubmitted.current &&
      typeof actionErrors === "string"
    ) {
      toast.error(actionErrors);
      hasSubmitted.current = false;
    }

    if (actionSuccess === true) {
      toast.success("Successfully reset your password");
    }
  }, [actionSuccess]);

  return (
    <Form method="POST" className="flex flex-col gap-6 w-md">
      <FormHeader
        title="Reset your password"
        description="Please enter your new password to reset it"
      />
      <div className="grid gap-6">
        <FormField
          id="newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          error={getFieldError(actionErrors, "newPassword")}
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Please confirm your password"
          error={getFieldError(actionErrors, "confirmPassword")}
        />
        <Button
          type="submit"
          className="w-full h-12 p-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          Reset Password
        </Button>
      </div>
      <FormFooter
        message="Already remembered your password?"
        linkText="Login"
        href="/login"
      />
    </Form>
  );
}
