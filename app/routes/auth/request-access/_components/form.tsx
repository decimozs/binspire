import { PendingVerification } from "@/components/shared/pending";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormFooter,
  FormHeader,
  FormRoleToggle,
  FormTextArea,
} from "@/components/ui/form";
import type { FormProps } from "@/lib/types";
import { getFieldError } from "@/lib/utils";
import type { requestAccessSchema } from "@/lib/validations.server";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigation } from "react-router";
import { toast } from "sonner";

type RequestAccessFormProps = FormProps<typeof requestAccessSchema>;

export default function RequestAccessForm({
  actionSuccess,
  actionErrors,
}: RequestAccessFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const hasSubmitted = useRef(false);
  const [requestPending, setRequestPending] = useState(false);

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
      toast.success("Request access sent successfully");
      setRequestPending(true);
    }
  }, [actionErrors, actionSuccess]);

  return (
    <>
      {!requestPending ? (
        <Form method="post" className="flex flex-col gap-6">
          <FormHeader
            title="Request Access"
            description="Provide your details below and we'll review your access request shortly."
          />
          <div className="grid gap-6">
            <FormField
              id="name"
              name="name"
              type="text"
              label="Name"
              placeholder="Enter your name"
              error={getFieldError(actionErrors, "name")}
            />
            <FormField
              id="email"
              name="email"
              type="text"
              label="Email"
              placeholder="email@example.com"
              error={getFieldError(actionErrors, "email")}
            />
            <FormField
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              label="Phone Number"
              placeholder="Enter your phone number"
              optional={true}
              error={getFieldError(actionErrors, "email")}
            />
            <FormTextArea
              id="reason"
              label="Reason"
              name="reason"
              placeholder="Enter your reason here why are your requesting access"
              error={getFieldError(actionErrors, "reason")}
            />
            <FormRoleToggle error={getFieldError(actionErrors, "role")} />
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
              Request Access
            </Button>
          </div>
          <FormFooter
            message="Already has an access?"
            linkText="Login"
            href="/login"
          />
        </Form>
      ) : (
        <PendingVerification identifier="request-access" />
      )}
    </>
  );
}
