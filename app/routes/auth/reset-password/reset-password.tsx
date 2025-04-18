import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import { FormField, FormFooter, FormHeader } from "@/components/ui/form";
import { getFieldError } from "@/lib/utils";
import type { Route } from "./+types/reset-password";
import { z } from "zod";
import db from "@/lib/db.server";
import { accountsTable, verificationsTable } from "@/db";
import { and, eq } from "drizzle-orm";
import { useEffect } from "react";
import { toast } from "sonner";
import argon2 from "argon2";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function loader({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const email = searchParams.get("e") as string;
  const token = searchParams.get("t") as string;

  if (!email || !token) {
    return redirect("/login");
  }

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  const verification = await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.value, token),
  });

  if (!user || !verification) {
    return redirect("/login");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = resetPasswordSchema.safeParse(data);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const email = searchParams.get("e") as string;
  const token = searchParams.get("t") as string;

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const newPassword = validatedData.data.newPassword;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  const userId = user?.id as string;

  const hashedPassword = await argon2.hash(newPassword);

  try {
    await db
      .update(accountsTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(accountsTable.userId, userId));

    await db
      .delete(verificationsTable)
      .where(
        and(
          eq(verificationsTable.value, token),
          eq(verificationsTable.identifier, "forgot-password"),
        ),
      );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
}

export default function ResetPasswordPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors;

  useEffect(() => {
    if (actionData?.success === true) {
      toast.success("Successfully reset your password");
    }
  }, [actionData]);

  return (
    <Form method="POST" className="flex flex-col gap-6">
      <FormHeader
        title="Reset your password"
        description="Please enter your new password to reset it"
      />
      <div className="grid gap-6">
        <FormField
          id="newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          error={getFieldError(errors, "newPassword")}
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Please confirm your password"
          error={getFieldError(errors, "confirmPassword")}
        />
        <Button
          type="submit"
          className="w-full h-12 p-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          Reset Password
        </Button>
      </div>
      <FormFooter
        message="Already remembered your password?"
        linkText="Login"
        href="/login"
      />
    </Form>
  );
}
