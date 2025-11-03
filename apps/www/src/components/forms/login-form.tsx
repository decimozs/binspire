import z from "zod";
import { useForm } from "@tanstack/react-form";
import { SubLogo } from "@/components/logo";
import { Link } from "@tanstack/react-router";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ShowToast } from "@/components/toast-notification";
import { useState } from "react";
import { authClient } from "@/features/auth";
import { FormFieldError } from "./components/form-field-error";
import {
  HistoryApi,
  MessagingApi,
  OrganizationApi,
  UserApi,
} from "@binspire/query";
import Policy from "../policy";
import { Loader2 } from "lucide-react";
import { messaging } from "@/features/firebase";
import { getToken } from "firebase/messaging";

const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setLoading(true);

      try {
        const { data, error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          rememberMe: value.rememberMe,
        });

        if (!data || error) {
          console.log(error);
          throw new Error(error.message);
        }

        const userId = data.user.id;
        const user = await UserApi.getById(userId);
        const org = await OrganizationApi.getById(user.orgId);

        try {
          const permission = await Notification.requestPermission();

          if (permission === "granted") {
            const token = await getToken(messaging, {
              vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            });

            if (token) {
              await MessagingApi.register(userId, token);
            }
          } else {
            console.warn("Notification permission not granted");
          }
        } catch (fcmError) {
          console.error("FCM registration failed:", fcmError);
        }

        await HistoryApi.create({
          orgId: org.id,
          title: `User ${user.name} signed in`,
          entity: "authentication",
          userId,
        });

        if (user.status.role === "admin") {
          setTimeout(() => {
            window.location.href = `https://${org.slug}.binspire.space/`;
          }, 1000);
        }

        if (user.status.role === "maintenance") {
          setTimeout(() => {
            window.location.href = "https://client.binspire.space/";
          }, 1000);
        }

        ShowToast("success", "Login successfully. Redirecting...");
        formApi.reset();
      } catch (err) {
        const error = err as Error;
        ShowToast(
          "error",
          error.message || "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="grid grid-cols-1 gap-4 w-screen px-4 md:w-md"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-3 mb-4">
        <SubLogo />
        <p className="text-4xl">Login</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p>Email</p>
          <form.Field name="email">
            {(field) => (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                  disabled={loading}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col gap-2">
          <p>Password</p>
          <form.Field name="password">
            {(field) => (
              <>
                <PasswordInput
                  placeholder="Enter your password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                  disabled={loading}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <form.Field name="rememberMe">
            {(field) => (
              <>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(Boolean(checked))
                  }
                />
                <p
                  className="text-muted-foreground font-normal text-sm"
                  onClick={() => field.handleChange(!field.state.value)}
                >
                  Remember me
                </p>
              </>
            )}
          </form.Field>
        </div>

        <Link
          to="/forgot-password"
          className="text-sm font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Login"}
      </Button>

      <Policy />
    </form>
  );
}
