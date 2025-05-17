import { SVG } from "@/components/shared/svg";
import { Button } from "@/components/ui/button";
import {
  FormDivider,
  FormField,
  FormFooter,
  FormHeader,
} from "@/components/ui/form";
import { getFieldError } from "@/lib/utils";
import { Loader2, LogIn } from "lucide-react";
import { Form, useLocation, useNavigate, useNavigation } from "react-router";
import type { loginSchema } from "@/lib/validations.server";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import type { FormProps } from "@/lib/types";

type LoginFormProps = FormProps<typeof loginSchema>;

export default function LoginForm({
  actionErrors,
  loaderError,
}: LoginFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const location = useLocation();
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (location.search || location.hash) {
      navigate(location.pathname, { replace: true });
    }

    if (isSubmitting) {
      hasSubmitted.current = true;
    }

    if (
      !isSubmitting &&
      hasSubmitted.current &&
      typeof actionErrors === "string" &&
      actionErrors === "Please verify your email first"
    ) {
      toast.warning(actionErrors);
      hasSubmitted.current = false;
      navigate("/verification?type=email-verification");
    }

    if (
      !isSubmitting &&
      hasSubmitted.current &&
      typeof actionErrors === "string"
    ) {
      toast.error(actionErrors);
      hasSubmitted.current = false;
    }

    if (loaderError === "account-not-found") {
      toast.warning("Account not found. Please request access first.");
    }
  }, [isSubmitting, actionErrors, loaderError]);

  return (
    <div className="flex flex-col">
      <Form method="post" className="flex w-md flex-col gap-6">
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
            error={getFieldError(actionErrors, "email")}
          />
          <FormField
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password here"
            option="field-with-sub-link"
            optionLabel="Forgot your password?"
            optionHref={`/verification?type=forgot-password`}
            error={getFieldError(actionErrors, "password")}
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
        </div>
      </Form>
      <a href="http://localhost:5173/api/auth/google/login">
        <Button
          variant="outline"
          className="w-full h-12 p-4 mt-6"
          type="submit"
        >
          <SVG icon="google" />
          Login with Google
        </Button>
      </a>
      <div className="mt-6">
        <FormFooter
          message="Don't have an access?"
          linkText="Request access"
          href="/request-access"
        />
      </div>
    </div>
  );
}
