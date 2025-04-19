import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { render } from "@react-email/components";
import { email as nodemailer } from "@/lib/email";
import { hashUrlToken } from "@/lib/utils";
import type { Route } from "./+types/verification";
import db from "@/lib/db.server";
import { verificationsTable } from "@/db";
import { nanoid } from "nanoid";
import env from "@config/env.server";
import EmailVerification from "@/components/email/email-verification";
import { toast } from "sonner";
import type { VerificationType } from "@/lib/types";
import { eq } from "drizzle-orm";
import { verificationSchema } from "@/lib/validations.server";
import VerificationForm from "./_components/form";
import { PendingVerification } from "@/components/shared/pending";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const token = searchParams.get("t");
  const email = searchParams.get("e");
  const type = searchParams.get("tp") as VerificationType;

  if (!type || !["email-verification", "forgot-password"].includes(type)) {
    return redirect("/login");
  }

  if (token) {
    const validateToken = await db.query.verificationsTable.findFirst({
      where: (table, { eq }) => eq(table.value, token),
    });

    if (!validateToken) {
      return redirect(
        `/verification-failed?e=${email}&t=${token}&tp=${type}&err=INVALID_TOKEN`,
      );
    }

    if (new Date(validateToken.expiresAt) < new Date()) {
      const verificationId = validateToken.id;
      await db
        .delete(verificationsTable)
        .where(eq(verificationsTable.id, verificationId));

      return redirect(
        `/verification-failed?e=${email}&t=${token}&tp=${type}&err=LINK_EXPIRED`,
      );
    }

    return redirect(
      `/verification-successful?e=${email}&t=${token}&tp=${type}`,
    );
  }

  return type;
}

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

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get("tp") as VerificationType;

  const email = validatedData.data.email;
  const verificationToken = nanoid();
  const token = hashUrlToken(verificationToken, env?.AUTH_SECRET!);
  const [verification] = await db
    .insert(verificationsTable)
    .values({
      identifier: type,
      value: token,
    })
    .returning({ token: verificationsTable.value });

  const emailHtml = await render(
    <EmailVerification
      email={email}
      token={verification.token}
      type={type}
      inviteFromIp="192.168.0.1"
      inviteFromLocation="Manila, Philippines"
    />,
  );

  const options = {
    from: "marlonadiguemartin548@gmail.com",
    to: email,
    subject: "Email Verification",
    html: emailHtml,
  };

  try {
    await nodemailer.sendMail(options);
    return {
      success: true,
    };
  } catch (error) {
    return {
      errors: "Failed to send email verification",
    };
  }
}

export default function VerificationPage() {
  const actionData = useActionData<typeof action>();
  const type = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors;
  const hasSubmitted = useRef(false);
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (!isSubmitting && hasSubmitted.current && typeof errors === "string") {
      toast.error(errors);
      hasSubmitted.current = false;
    }

    if (actionData?.success === true) {
      toast.success("Email verification link sent");
      setPending(true);
    }
  }, [isSubmitting, errors, actionData]);

  return (
    <>
      {!isPending ? (
        <VerificationForm
          errors={
            typeof errors === "object" && !Array.isArray(errors)
              ? errors
              : undefined
          }
          isSubmitting={isSubmitting}
        />
      ) : (
        <PendingVerification identifier={type} />
      )}
    </>
  );
}
