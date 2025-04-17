import {
  AlertCircle,
  CheckCircle,
  Loader2,
  LogIn,
  Mail,
  XCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router";
import { render } from "@react-email/components";
import { email as nodemailer } from "~/lib/email";
import { Button } from "~/components/ui/button";
import { FormField, FormFooter, FormHeader } from "~/components/ui/form";
import { getFieldError, hashUrlToken } from "~/lib/utils";
import type { Route } from "./+types/verification";
import db from "~/lib/db";
import { verificationsTable } from "~/db";
import { nanoid } from "nanoid";
import env from "@config/env.server";
import EmailVerification from "~/components/email/email-verification";
import { toast } from "sonner";
import type { VerificationType } from "~/lib/types";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const verificationSchema = z.object({
  email: z.string().min(1, "Email is required"),
});

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
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors;
  const hasSubmitted = useRef(false);
  const [isPending, setPending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [loaderPending, setLoaderPending] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [login, setLogin] = useState(false);
  const [isPendingHeader, setPendingHeader] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const resetState = () => {
    setPending(false);
    setVerificationSuccess(false);
    setVerificationFailed(false);
    setLoaderPending(false);
    setResetPassword(false);
    setLogin(false);
    setPendingHeader(false);
    setEmail("");
    setToken("");
  };

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
      setLoaderPending(true);
    }
  }, [isSubmitting, errors]);

  useEffect(() => {
    const channel = new BroadcastChannel("email-verification");

    channel.onmessage = (event) => {
      const { type, email, verificationType, token } = event.data;

      console.log(event.data);

      if (type === "success" && verificationType === "email-verification") {
        setLoaderPending(false);
        setVerificationSuccess(true);
        setPendingHeader(true);
        setLogin(true);
        setToken(token);
        setEmail(email);
      }

      if (type === "success" && verificationType === "forgot-password") {
        setLoaderPending(false);
        setVerificationSuccess(true);
        setPendingHeader(true);
        setResetPassword(true);
        setLogin(false);
        setToken(token);
        setEmail(email);
      }

      if (type === "failed") {
        setLoaderPending(false);
        setPendingHeader(true);
        setVerificationFailed(true);
        setEmail(email);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  return (
    <div>
      {!isPending ? (
        <Form method="post" className="flex flex-col gap-6">
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
      ) : (
        <div className="flex flex-col gap-6">
          {!isPendingHeader && (
            <FormHeader
              title="Verification Pending"
              description="Please check your inbox and click the link to verify your email address."
            />
          )}
          {(resetPassword || verificationSuccess || verificationFailed) && (
            <FormHeader
              title="Verification Status"
              description="Please check your inbox and click the link to verify your email address."
            />
          )}
          {verificationSuccess && (
            <div
              className={
                "flex items-center justify-center border-[1px] border-input p-4 rounded-sm bg-green-50"
              }
            >
              <div className="flex items-center justify-center gap-2 flex-col">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-7 w-7 text-green-500" />
                </div>
                <div className="flex items-center justify-center flex-col">
                  <h1 className="font-bold">Email Verified</h1>
                  <p className="text-sm">{email}</p>
                </div>
              </div>
            </div>
          )}
          {verificationFailed && (
            <div
              className={
                "flex items-center justify-center border-[1px] border-input p-4 rounded-sm bg-red-50"
              }
            >
              <div className="flex items-center justify-center gap-2 flex-col">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="flex items-center justify-center flex-col">
                  <h1 className="font-bold">Failed Verification</h1>
                  <p className="text-sm">{email}</p>
                </div>
              </div>
            </div>
          )}
          {loaderPending ? (
            <div
              className={
                "flex items-center justify-center border-[1px] border-input p-4 rounded-sm "
              }
            >
              <Loader2 className="animate-spin" />
            </div>
          ) : null}
          <p className="text-muted-foreground text-sm text-center">
            {!resetPassword
              ? "If you don't see the email in your inbox, please check your spam folder."
              : "You can now reset your password, please update it carefully."}
          </p>
          <div className="grid gap-6">
            {login && (
              <Button
                type="submit"
                className="w-full h-12 p-4"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
            {!resetPassword && !verificationSuccess ? (
              <Button
                type="submit"
                className="w-full h-12 p-4"
                onClick={resetState}
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Link
              </Button>
            ) : null}
            {resetPassword && (
              <Button
                type="submit"
                className="w-full h-12 p-4"
                onClick={() => {
                  navigate(`/reset-password?e=${email}&t=${token}`);
                  console.log("email: ", email);
                  console.log("token: ", token);
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
