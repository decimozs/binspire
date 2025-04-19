import {
  Form,
  redirect,
  replace,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router";
import type { Route } from "./+types/sign-up";
import { FormDivider, FormField, FormHeader } from "@/components/ui/form";
import { getFieldError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleCheck, Loader2, LogIn, Mail, Phone } from "lucide-react";
import { SVG } from "@/components/shared/svg";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";
import db from "@/lib/db.server";
import { googleSignupSchema, signupSchema } from "@/lib/validations.server";
import { accountsTable, usersTable } from "@/db";
import { nanoid } from "nanoid";
import argon2 from "argon2";
import { toast } from "sonner";
import { commitSession, getSession } from "@/lib/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  const token = searchParams.get("t");
  const orgId = searchParams.get("o");
  const permission = searchParams.get("p");

  if (!id || !token || !orgId || !permission) {
    return redirect("/login");
  }

  const user = await db.query.requestAccessTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });

  const verification = await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.value, token),
  });

  const organization = await db.query.organizationsTable.findFirst({
    where: (table, { eq }) => eq(table.id, orgId),
  });

  if (
    !verification ||
    !user ||
    !organization ||
    !["viewer", "editor", "full-access"].includes(permission)
  ) {
    return redirect("/login");
  }

  return { user, orgId, permission };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const validatedData = signupSchema.safeParse(data);
  const googleValidatedData = googleSignupSchema.safeParse(data);
  const intent = formData.get("intent");

  if (intent === "email") {
    console.log("go with email hit");
    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { password, confirmPassword, ...userData } = validatedData.data;

    const [user] = await db
      .insert(usersTable)
      .values({
        ...userData,
        emailVerified: true,
      })
      .returning();

    const accountId = nanoid();
    const userId = user.id;
    const hashedPassword = await argon2.hash(password);

    await db.insert(accountsTable).values({
      accountId: accountId,
      providerId: "email",
      userId: userId,
      password: hashedPassword,
    });

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

  if (intent === "google") {
    console.log("go with google hit");

    if (!googleValidatedData.success) {
      return {
        errors: googleValidatedData.error.flatten().fieldErrors,
      };
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        ...googleValidatedData.data,
        emailVerified: true,
      })
      .returning();

    const accountId = nanoid();
    const userId = user.id;

    await db.insert(accountsTable).values({
      accountId: accountId,
      providerId: "google",
      userId: userId,
    });

    return redirect("/auth/google/signup");
  }
}

export default function SignUpPage() {
  const actionData = useActionData<typeof action>();
  const { user, orgId, permission } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors;
  const hasSubmitted = useRef(false);
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [intent, setIntent] = useState("");
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (!isSubmitting && hasSubmitted.current && typeof errors === "string") {
      toast.error(errors);
      hasSubmitted.current = false;
    }
  }, [isSubmitting, errors]);

  return (
    <div className="flex flex-col">
      {!confirmAccount ? (
        <div className="flex w-md flex-col gap-6">
          <FormHeader
            title="Create your account"
            description="You're approved! Confirm your details below to complete your signup and get started."
          />
          <div className="grid gap-6">
            <div>
              <Label htmlFor="user-info" className="text-sm font-medium">
                Personal Information
              </Label>
              <div
                className="text-sm border-[1px] border-input p-4 rounded-md my-2 grid grid-cols-[70px_1fr]"
                id="user-info"
              >
                <Avatar className="w-[50px] h-[50px]">
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((point) => point[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-lg">{user.name}</p>
                    <Badge className="capitalize">{user.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                    <Mail size={15} className="mt-[0.1rem]" />
                    {user.email}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                    <Phone size={15} className="mt-[0.1rem]" />
                    {user.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              className="w-full h-12 p-4"
              onClick={() => setConfirmAccount(true)}
            >
              <CircleCheck className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-md flex-col gap-6">
          <Form method="POST" className="flex w-md flex-col gap-6">
            <FormHeader
              title="Create your account"
              description="You're approved! Confirm your details below to complete your signup and get started."
            />
            <div className="grid gap-6">
              <FormField
                id="email"
                name="email"
                type="text"
                label="Email"
                placeholder="email@example.com"
                value={user.email}
                disabled={true}
                readOnly={true}
                error={getFieldError(errors, "email")}
              />
              <FormField
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password here"
                error={getFieldError(errors, "password")}
              />
              <FormField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Please confirm your password here"
                error={getFieldError(errors, "confirmPassword")}
              />
              <input type="hidden" name="email" value={user.email} />
              <input type="hidden" name="role" value={user.role} />
              <input type="hidden" name="name" value={user.name} />
              <input type="hidden" name="orgId" value={orgId} />
              <input type="hidden" name="permission" value={permission} />
              <input type="hidden" name="intent" value={intent} />
              <Button
                type="submit"
                className="w-full h-12 p-4"
                disabled={isSubmitting && intent === "email"}
                onClick={(e) => {
                  setIntent("email");
                  submit(e.currentTarget);
                }}
              >
                {isSubmitting && intent === "email" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Sign up with Email and Password
              </Button>
              <FormDivider label="Or continue with" />
              <Button
                variant="outline"
                className="w-full h-12 p-4"
                type="submit"
                onClick={(e) => {
                  setIntent("google");
                  submit(e.currentTarget);
                }}
              >
                <SVG icon="google" />
                Sign up with Google
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full h-12 p-4 mt-[-1rem]"
              type="button"
              onClick={() => setConfirmAccount(false)}
            >
              Back
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
