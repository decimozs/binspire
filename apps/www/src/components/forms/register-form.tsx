import z from "zod";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/features/auth";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { FormFieldError } from "./components/form-field-error";
import { Input, PasswordInput } from "../ui/input";
import { ShowToast } from "../toast-notification";
import { DEFAULT_PERMISSIONS } from "@binspire/shared";
import {
  UserInvitationsApi,
  UserQuotaApi,
  UserSettingsApi,
  UserStatusApi,
  type UserInvitation,
} from "@binspire/query";
import { SubLogo } from "../logo";
import Policy from "../policy";

const registerFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm({ id, email }: UserInvitation) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email,
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setLoading(true);

        const invitation = await UserInvitationsApi.getById(id);

        if (!invitation) throw new Error("Invalid or expired invitation");

        const { data, error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          orgId: invitation.orgId,
        });

        if (error || !data)
          throw new Error(error?.message || "Failed to register.");

        const newUser = data;
        const permission = DEFAULT_PERMISSIONS[invitation.permission];

        await UserStatusApi.create({
          userId: newUser.user.id,
          role: invitation.role,
          permission,
        });

        await UserQuotaApi.create({
          userId: newUser.user.id,
        });

        await UserSettingsApi.create({
          userId: newUser.user.id,
          settings: {
            appearance: {
              theme: "dark",
              font: "manrope",
              liveUpdatesOnMap: true,
            },
          },
        });

        await UserInvitationsApi.update(id, {
          status: "accepted",
        });

        ShowToast("success", "Registration successful! Redirecting...");

        if (invitation.role === "admin") {
          window.location.href = "/login";
        }

        if (invitation.role === "maintenance") {
          window.location.href = `/download-client?id=${invitation.id}`;
        }
      } catch (err) {
        const error = err as Error;
        ShowToast(
          "error",
          error.message || "Failed to register. Something went wrong.",
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
        <p className="text-4xl">Create your Account</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p>Name</p>
          <form.Field name="name">
            {(field) => (
              <>
                <Input
                  type="test"
                  placeholder="Enter your name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>

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
                  disabled
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
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col gap-2">
          <p>Confirm Password</p>
          <form.Field name="confirmPassword">
            {(field) => (
              <>
                <PasswordInput
                  placeholder="Please confirm your password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Register"}
      </Button>

      <Policy />
    </form>
  );
}
