import { Button } from "@/components/ui/button";
import {
  FormField,
  FormFooter,
  FormHeader,
  FormRoleToggle,
  FormTextArea,
} from "@/components/ui/form";
import { getFieldError } from "@/lib/utils";
import type { requestAccessSchema } from "@/lib/validations.server";
import { Loader2, Mail } from "lucide-react";
import { Form } from "react-router";
import { z } from "zod";

type RequestAccessErrors = z.inferFlattenedErrors<
  typeof requestAccessSchema
>["fieldErrors"];

export default function RequestAccessForm({
  errors,
  isSubmitting,
}: {
  errors?: RequestAccessErrors;
  isSubmitting: boolean;
}) {
  return (
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
          error={getFieldError(errors, "name")}
        />
        <FormField
          id="email"
          name="email"
          type="text"
          label="Email"
          placeholder="email@example.com"
          error={getFieldError(errors, "email")}
        />
        <FormField
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          label="Phone Number"
          placeholder="Enter your phone number"
          optional={true}
          error={getFieldError(errors, "email")}
        />
        <FormTextArea
          id="reason"
          label="Reason"
          name="reason"
          placeholder="Enter your reason here why are your requesting access"
          error={getFieldError(errors, "reason")}
        />
        <FormRoleToggle error={getFieldError(errors, "role")} />
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
  );
}
