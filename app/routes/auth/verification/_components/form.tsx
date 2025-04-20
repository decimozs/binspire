import { PendingVerification } from "@/components/shared/pending";
import { Button } from "@/components/ui/button";
import { FormField, FormFooter, FormHeader } from "@/components/ui/form";
import type { FormProps, VerificationType } from "@/lib/types";
import { getFieldError } from "@/lib/utils";
import type { verificationSchema } from "@/lib/validations.server";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigation } from "react-router";
import { toast } from "sonner";

type VerificationFormProps = FormProps<typeof verificationSchema> & {
  verificationType: VerificationType;
};

export default function VerificationForm({
  actionSuccess,
  actionErrors,
  verificationType,
}: VerificationFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const hasSubmitted = useRef(false);
  const [isPending, setPending] = useState(false);

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
      toast.success("Email verification link sent");
      setPending(true);
    }
  }, [isSubmitting, actionSuccess, actionErrors]);

  return (
    <>
      {!isPending ? (
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
              error={getFieldError(actionErrors, "email")}
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
      ) : (
        <PendingVerification identifier={verificationType} />
      )}
    </>
  );
}
