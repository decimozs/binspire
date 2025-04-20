import React, { useEffect, useRef, useState } from "react";
import { useActionData, useLoaderData, useNavigation } from "react-router";
import { render } from "@react-email/components";
import type { Route } from "./+types/verification";
import EmailVerification from "@/components/email/email-verification";
import { toast } from "sonner";
import VerificationForm from "./_components/form";
import { PendingVerification } from "@/components/shared/pending";
import { verification } from "@/action/auth.server";
import { sendEmail } from "@/action/email.server";
import { verificationLoader } from "@/loader/auth.server";
import type { MailOptions } from "nodemailer/lib/json-transport";

export async function loader({ request }: Route.LoaderArgs) {
  return await verificationLoader(request);
}

export async function action({ request }: Route.ActionArgs) {
  const { email, token, type } = await verification(request);

  const emailHtml = await render(
    <EmailVerification
      email={email as string}
      token={token as string}
      type={type as string}
      inviteFromIp="192.168.0.1"
      inviteFromLocation="Manila, Philippines"
    />,
  );

  const options = {
    from: "marlonadiguemartin548@gmail.com",
    to: email,
    subject: "Email Verification",
    html: emailHtml,
  } as MailOptions;

  return await sendEmail(options);
}

export default function VerificationPage() {
  const actionData = useActionData<typeof action>();
  const type = useLoaderData<typeof loader>();

  return (
    <VerificationForm
      actionSuccess={actionData?.success}
      actionErrors={actionData?.errors}
      verificationType={type}
    />
  );
}
