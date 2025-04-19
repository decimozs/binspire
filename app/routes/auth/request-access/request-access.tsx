import { useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/request-access";
import { hashUrlToken } from "@/lib/utils";
import db from "@/lib/db.server";
import { requestAccessTable, verificationsTable } from "@/db";
import env from "@config/env.server";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import RequestAccessForm from "./_components/form";
import { requestAccessSchema } from "@/lib/validations.server";
import { PendingVerification } from "@/components/shared/pending";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = requestAccessSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

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
      ...validatedData.data,
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
  const [requestPending, setRequestPending] = useState(false);

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
      setRequestPending(true);
    }
  }, [errors, actionData]);

  return (
    <>
      {!requestPending ? (
        <RequestAccessForm errors={errors} isSubmitting={isSubmitting} />
      ) : (
        <PendingVerification identifier="request-access" />
      )}
    </>
  );
}
