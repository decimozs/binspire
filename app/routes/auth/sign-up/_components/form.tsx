import { SVG } from "@/components/shared/svg";
import { FormDivider, FormField, FormHeader } from "@/components/ui/form";
import type { FormProps } from "@/lib/types";
import { getFieldError } from "@/lib/utils";
import type { signupSchema } from "@/lib/validations.server";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigation, useSubmit } from "react-router";
import { toast } from "sonner";
import ConfirmAccount from "./confirm-account";
import type { requestAccessTable } from "@/db";

type User = typeof requestAccessTable.$inferSelect;
type SignUpFormProps = FormProps<typeof signupSchema> & {
  user: User;
  orgId: string;
  permission: string;
};

export default function SignUpForm({
  actionErrors,
  user,
  orgId,
  permission,
}: SignUpFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const hasSubmitted = useRef(false);
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [intent, setIntent] = useState("");
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (
      !isSubmitting &&
      hasSubmitted.current &&
      typeof actionErrors === "string"
    ) {
      toast.error(actionErrors);
      hasSubmitted.current = false;
    }
  }, [isSubmitting, actionErrors]);

  const handleConfirmAccount = () => setConfirmAccount(true);

  return (
    <div className="flex flex-col">
      {!confirmAccount ? (
        <ConfirmAccount user={user} onConfirm={handleConfirmAccount} />
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
                error={getFieldError(actionErrors, "email")}
              />
              <FormField
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password here"
                error={getFieldError(actionErrors, "password")}
              />
              <FormField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Please confirm your password here"
                error={getFieldError(actionErrors, "confirmPassword")}
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
