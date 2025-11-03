import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import { CircleCheckIcon, Loader2, Mail, X } from "lucide-react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ShowToast } from "@/components/core/toast-notification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { usePermissionStore } from "@/store/permission-store";
import { useSendInvitationEmail } from "@binspire/query";
import { parseAsBoolean, useQueryState } from "nuqs";

type Invite = {
  email: string;
  role: string;
  permission: string;
};

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.string(),
  permission: z.string(),
});

export default function InviteUser() {
  const [invitingUserQuery, setInvitingUserQuery] = useQueryState(
    "inviting_user",
    parseAsBoolean.withDefault(false),
  );
  const [emails, setEmails] = useState<Invite[]>([]);
  const sendInvite = useSendInvitationEmail();
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const { permission } = usePermissionStore();

  const [emailError, setEmailError] = useState<string>("");

  const hasPermission = permission.userManagement?.actions.create;

  const form = useForm({
    defaultValues: { email: "", role: "admin", permission: "viewer" },
    validators: {
      onSubmit: inviteUserSchema,
    },
    onSubmit: async ({ formApi }) => {
      if (emails.length === 0) {
        return;
      }

      setEmails([]);
      formApi.reset();
    },
  });

  const handleAddEmail = (email: string) => {
    const trimmed = email.trim();

    if (!trimmed) {
      setEmailError("Please enter an email address.");
      return;
    }

    const result = inviteUserSchema.shape.email.safeParse(trimmed);

    if (!result.success) {
      setEmailError("Invalid email address");
      return;
    }

    if (emails.some((e) => e.email === trimmed)) {
      setEmailError("This email is already added.");
      return;
    }

    setEmails((prev) => [
      ...prev,
      {
        email: trimmed,
        role: form.getFieldValue("role"),
        permission: form.getFieldValue("permission"),
      },
    ]);

    setEmailError("");
    form.resetField("email");
  };

  const handleSendInvites = async () => {
    if (emails.length === 0) return;

    await Promise.all(
      emails.map(async (data) => {
        await sendInvite.mutateAsync(data);
        setSentEmails((prev) => [...prev, data.email]);
      }),
    );

    setTimeout(() => {
      setEmails([]);
      setSentEmails([]);
    }, 2000);

    form.reset();

    ShowToast("success", "Invitation emails sent successfully.");
  };

  const handleRemoveEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e.email !== email));
  };

  if (!hasPermission) return null;

  return (
    <Dialog open={invitingUserQuery} onOpenChange={setInvitingUserQuery}>
      <DialogContent>
        <form
          id="invite-user-form"
          className="grid grid-cols-1 gap-4 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Invite new user to join your team by sending them an email
              invitation.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p>Email</p>
              <form.Field name="email">
                {(field) => (
                  <>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={field.state.value}
                      disabled={sendInvite.isPending}
                      onChange={(e) => {
                        // update form value and clear local error on change
                        field.handleChange(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEmail(field.state.value);
                        }
                      }}
                    />
                    {/* Custom inline field error (matches the style you requested) */}
                    {emailError ? (
                      <p
                        className="text-sm text-destructive mt-1"
                        role="alert"
                        aria-live="polite"
                      >
                        {emailError}
                      </p>
                    ) : null}
                  </>
                )}
              </form.Field>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p>Role </p>
                <p className="text-xs text-muted-foreground">Default Admin</p>
                <form.Field name="role">
                  {(field) => (
                    <>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p>Permission</p>
                <p className="text-xs text-muted-foreground">Default Viewer</p>
                <form.Field name="permission">
                  {(field) => (
                    <>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Permission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="superuser">Superuser</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </form.Field>
              </div>
            </div>
          </div>

          {emails.length > 0 && (
            <div className="flex flex-col gap-1">
              <p>Invitations</p>
              {emails.map((item) => (
                <div
                  className="relative rounded-md border border-muted px-4 py-2"
                  key={item.email}
                >
                  <div className="flex flex-row items-start gap-2">
                    {sentEmails.includes(item.email) ? (
                      <CircleCheckIcon
                        className="text-green-500 mt-[4px]"
                        size={15}
                      />
                    ) : (
                      <Mail
                        className="text-muted-foreground mt-[4px]"
                        size={15}
                      />
                    )}
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {item.email}
                      </p>
                      <div className="flex flex-row gap-1 items-center">
                        <p className="text-xs text-muted-foreground capitalize border border-md rounded-md px-2 py-0.5">
                          {item.role}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize border border-md rounded-md px-2 py-0.5">
                          {item.permission}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!sentEmails.includes(item.email) && (
                    <X
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-accent hover:text-destructive cursor-pointer transition-colors duration-200"
                      size={15}
                      onClick={() => handleRemoveEmail(item.email)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            className="w-full"
            size="sm"
            disabled={emails.length === 0 || sendInvite.isPending}
            onClick={handleSendInvites}
          >
            {sendInvite.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send Invitations"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
