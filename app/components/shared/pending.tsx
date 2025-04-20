import {
  CheckCircle,
  CircleCheck,
  Loader2,
  LogIn,
  Phone,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FormFooter } from "../ui/form";
import type { VerificationStatus, VerificationType } from "@/lib/types";

const PendingVerification = ({
  identifier,
}: {
  identifier: VerificationType | undefined;
}) => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const channel = new BroadcastChannel("email-verification");

    channel.onmessage = (event) => {
      const { type, email, verificationType, token } = event.data;

      console.log(event.data);

      if (type === "success" && verificationType === "email-verification") {
        setToken(token);
        setEmail(email);
        setVerificationStatus("success");
      }

      if (type === "success" && verificationType === "forgot-password") {
        setToken(token);
        setEmail(email);
        setVerificationStatus("success");
      }

      if (type === "failed") {
        setVerificationStatus("failed");
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4 max-w-md">
      <div className="w-full space-y-6 text-center max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {identifier !== "request-access"
              ? "Verification Pending"
              : "Request Access Pending"}
          </h1>
          <p className="text-muted-foreground">
            {identifier !== "request-access"
              ? "We've sent a verification link to your email. Please check your inbox and click the link to complete your verification."
              : "Your request is being reviewed by an administrator"}
          </p>
        </div>
        {verificationStatus === "success" ? (
          <div className="flex items-center justify-center border-[1px] border-input p-4 rounded-sm bg-green-50">
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
        ) : verificationStatus === "failed" ? (
          <div className="flex items-center justify-center border-[1px] border-destructive p-4 rounded-sm bg-red-50">
            <div className="flex items-center justify-center gap-2 flex-col">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-7 w-7 text-red-500" />
              </div>
              <div className="flex items-center justify-center flex-col">
                <h1 className="font-bold text-destructive">
                  Verification Failed
                </h1>
                <p className="text-sm">
                  The verification link is invalid or expired.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border bg-background p-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          </div>
        )}
        <Alert>
          <AlertTitle>
            {identifier !== "request-access"
              ? "Next Steps"
              : "What happens next?"}
          </AlertTitle>
          <AlertDescription>
            {identifier === "email-verification" &&
              "Once your email is successfully verified, your account will be activated and you’ll be able to explore and use all the features of our platform."}
            {identifier === "forgot-password" &&
              "Once your email is verified, you’ll be redirected to reset your password. This ensures your account remains secure and that only you can update your login credentials."}
            {identifier === "request-access" &&
              "An administrator will review your request and grant access. You'll receive an email notification once approved."}
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => {
              navigate(
                identifier === "forgot-password"
                  ? `/reset-password?e=${email}&t=${token}`
                  : "/login",
              );
            }}
            className="h-12 p-4 w-full"
            disabled={
              identifier !== "request-access" ? !verificationStatus : false
            }
          >
            {identifier === "forgot-password" && (
              <>
                <CircleCheck className="mr-2 h-4 w-4" />
                Reset Password
              </>
            )}
            {identifier === "email-verification" && (
              <>
                <CircleCheck className="mr-2 h-4 w-4" />
                Confirm Verification
              </>
            )}
            {identifier === "request-access" && (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Back to Login
              </>
            )}
          </Button>
          <Button variant="outline" className="h-12 p-4 w-full">
            <Phone className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          {identifier !== "request-access"
            ? "Didn’t receive the email? Be sure to check your spam or junk folder."
            : "Your request has been submitted. Please wait while an administrator reviews and approves your access."}
        </p>
        <FormFooter message="Back to" linkText="Login" href="/login" />
      </div>
    </div>
  );
};

export { PendingVerification };
