import { Form, useActionData, useNavigation } from "react-router";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/request-access";
import { FormField, FormFooter, FormHeader } from "@/components/ui/form";
import { getFieldError, hashUrlToken } from "@/lib/utils";
import { Loader2, Mail } from "lucide-react";
import { verificationSchema } from "../verification/verification";
import db from "@/lib/db.server";
import { requestAccessTable, verificationsTable } from "@/db";
import env from "@config/env.server";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const formEmail = formData.get("email");
  const validatedData = verificationSchema.safeParse({
    email: formEmail,
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const email = validatedData.data.email;

  try {
    const verificationToken = nanoid();
    const token = hashUrlToken(verificationToken, env?.AUTH_SECRET!);
    const [verification] = await db
      .insert(verificationsTable)
      .values({
        identifier: "request-access",
        value: token,
      })
      .returning();

    const verificationId = verification.id;

    await db.insert(requestAccessTable).values({
      email: email,
      status: "pending",
      verificationId: verificationId,
    });

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
}

export default function RequestAccessPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors;
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (!isSubmitting && hasSubmitted.current && typeof errors === "string") {
      toast.error(errors);
      hasSubmitted.current = false;
    }

    if (actionData?.success === true) {
      toast.success("Request access sent successfully");
    }
  }, [errors, actionData, errors]);

  return (
    <Form method="post" className="flex flex-col gap-6">
      <FormHeader
        title="Request Access"
        description="Provide your email address and we'll review your access request shortly."
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
          Request Access
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
