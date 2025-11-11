import z from "zod";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { authClient } from "@/features/auth";
import {
  HistoryApi,
  MessagingApi,
  OrganizationApi,
  UserApi,
  UserStatusApi,
} from "@binspire/query";
import { Loader2 } from "lucide-react";
import { SubLogo } from "@/components/logo";
import { Input, PasswordInput } from "@binspire/ui/components/input";
import { Checkbox } from "@binspire/ui/components/checkbox";
import { FormFieldError } from "@binspire/ui/forms";
import { ShowToast } from "@/components/toast";
import { Button } from "@binspire/ui/components/button";
import Policy from "@/components/policy";
import { messaging } from "@/features/firebase";
import { getToken } from "firebase/messaging";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: schema,
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
              console.log("FCM Token registered:", token);
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

        await UserStatusApi.update(userId, {
          isOnline: true,
        });

        if (user.status.role === "admin") {
          setTimeout(() => {
            window.location.href = `https://${org.slug}.binspire.space/`;
          }, 1000);
        }

        formApi.reset();
        window.location.href = "/";
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
      className="grid grid-cols-1 gap-4 w-full px-4 md:w-md"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-3 mb-4">
        <p className="orange-badge">Client</p>
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

        <p
          className="text-sm font-medium hover:underline"
          onClick={() => {
            window.location.href = "https://www.binspire.space/forgot-password";
          }}
        >
          Forgot password?
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Login"}
      </Button>

      <Policy />
    </form>
  );
}
