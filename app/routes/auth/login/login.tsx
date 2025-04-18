import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FormDivider,
  FormField,
  FormFooter,
  FormHeader,
} from "@/components/ui/form";
import { Loader2, LogIn } from "lucide-react";
import { SVG } from "@/components/shared/svg";
import { z } from "zod";
import db from "@/lib/db.server";
import argon2 from "argon2";
import { getFieldError } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { commitSession, getSession } from "@/lib/sessions.server";
import type { Route } from "./+types/login";
import { accountsTable } from "@/db";
import { and, eq } from "drizzle-orm";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const email = validatedData.data.email;
  const password = validatedData.data.password;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user?.email) {
    return {
      errors: "Email not found, Please request access first",
    };
  }

  if (!user.emailVerified) {
    return {
      errors: "Please verify your email first",
    };
  }

  const userId = user.id;
  const [account] = await db
    .select()
    .from(accountsTable)
    .where(
      and(
        eq(accountsTable.userId, userId),
        eq(accountsTable.providerId, "email"),
      ),
    );

  if (!account) {
    return {
      errors: "Account not found. Please request access first",
    };
  }

  const accountPassword = account.password as string;
  const isPasswordValid = await argon2.verify(accountPassword, password);

  if (!isPasswordValid) {
    return {
      errors: "Invalid password",
    };
  }

  const orgId = user.orgId as string;
  const org = await db.query.organizationsTable.findFirst({
    where: (table, { eq }) => eq(table.id, orgId),
  });

  if (!org) {
    return {
      errors: "Organization not found",
    };
  }

  const ipAddress = request.headers.get("x-forwarded-for");
  const userAgent = request.headers.get("user-agent");
  const session = await getSession(request.headers.get("cookie"));
  session.set("userId", user.id);
  session.set("orgId", user.orgId);
  session.set("ipAddress", ipAddress);
  session.set("userAgent", userAgent);
  session.set("permission", user.permission);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors;
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (
      !isSubmitting &&
      hasSubmitted.current &&
      typeof errors === "string" &&
      errors === "Please verify your email first"
    ) {
      toast.warning(errors);
      hasSubmitted.current = false;
      navigate("/verification?tp=email-verification");
    }

    if (!isSubmitting && hasSubmitted.current && typeof errors === "string") {
      toast.error(errors);
      hasSubmitted.current = false;
    }
  }, [isSubmitting, errors]);

  return (
    <Form method="post" className="flex flex-col gap-6">
      <FormHeader
        title="Login to your account"
        description="Enter your email below to login to your account"
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
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password here"
          option="field-with-sub-link"
          optionLabel="Forgot your password?"
          optionHref={`/verification?tp=forgot-password`}
          error={getFieldError(errors, "password")}
        />
        <Button
          type="submit"
          className="w-full h-12 p-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          Login
        </Button>
        <FormDivider label="Or continue with" />
        <Form method="GET" action="/auth/callback/google">
          <Button variant="outline" className="w-full h-12 p-4" type="submit">
            <SVG icon="google" />
            Login with Google
          </Button>
        </Form>
      </div>
      <FormFooter
        message="Don't have an access?"
        linkText="Request access"
        href="/request-access"
      />
    </Form>
  );
}
