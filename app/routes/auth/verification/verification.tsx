import { useActionData, useLoaderData, useNavigation } from "react-router";
import { render } from "@react-email/components";
import type { Route } from "./+types/verification";
import EmailVerification from "@/components/email/email-verification";
import VerificationForm from "./_components/form";
import { verification } from "@/action/auth.action.server";
import { sendEmail } from "@/action/email.action.server";
import { verificationLoader } from "@/loader/auth.loader.server";
import type { MailOptions } from "nodemailer/lib/json-transport";

export async function loader({ request }: Route.LoaderArgs) {
  return await verificationLoader(request);
}

export async function action({ request }: Route.ActionArgs) {
  const { email, token, type, errors } = await verification(request);

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

  const emailVerification = await sendEmail(options);

  return {
    emailVerification,
    errors,
  };
}

export default function VerificationPage() {
  const actionData = useActionData<typeof action>();
  const type = useLoaderData<typeof loader>();

  return (
    <VerificationForm
      actionSuccess={actionData?.emailVerification.success}
      actionErrors={actionData?.errors}
      verificationType={type}
    />
  );
}
