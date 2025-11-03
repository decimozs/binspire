import { ShowToast } from "@/components/core/toast-notification";
import { authClient } from "@/lib/auth-client";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { PasswordInput } from "@binspire/ui/components/input";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import z from "zod";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmNewPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
  });

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        console.log(value);
        setLoading(true);
        const { data, error } = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: true,
        });

        if (error || !data) {
          throw new Error(error?.message || "Failed to change password");
        }

        formApi.reset();
        setOpen(false);
        ShowToast("success", "Password changed successfully.");
      } catch {
        ShowToast("error", "Failed to change password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <KeyRound />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>Change Your Password</DialogTitle>
              <DialogDescription>
                Update your account password to keep your account secure. Make
                sure to use a strong and unique password that you haven’t used
                elsewhere.
              </DialogDescription>
            </DialogHeader>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Current password</p>
              <form.Field name="currentPassword">
                {(field) => (
                  <>
                    <PasswordInput
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your current password"
                      field={field}
                    />
                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm">New password</p>
              <form.Field name="newPassword">
                {(field) => (
                  <>
                    <PasswordInput
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your new password"
                      field={field}
                    />
                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm">Confirm password</p>
              <form.Field name="confirmNewPassword">
                {(field) => (
                  <>
                    <PasswordInput
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Please confirm your password"
                      field={field}
                    />
                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <Button size="sm" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
