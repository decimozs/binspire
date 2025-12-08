import { UserInvitationsApi, VerificationApi } from "@binspire/query";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { rpc } from "@/features/api-client";
import { SubLogo } from "../logo";
import { ShowToast } from "../toast-notification";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormFieldError } from "./components/form-field-error";

export interface InvitationFormProps {
  invitationId: string;
  email: string;
  token: string;
  rawCredentials: {
    id: string;
    token: string;
  };
}

const invitationFormSchema = z.object({
  email: z.email(),
  token: z.string().min(1),
});

export default function InvitationForm({
  invitationId,
  email,
  token,
  rawCredentials,
}: InvitationFormProps) {
  const [isConfirming, setConfirming] = useState(false);
  const [isRejecting, setRejecting] = useState(false);

  const form = useForm({
    defaultValues: {
      email,
      token,
    },
    validators: {
      onSubmit: invitationFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setConfirming(true);

        const verification = await VerificationApi.verify(value.token);

        if (!verification) {
          throw new Error("Failed to accept invitation");
        }

        await UserInvitationsApi.update(invitationId, {
          status: "confirmed",
        });

        window.location.href = `https://www.binspire.space/register?id=${encodeURIComponent(rawCredentials.id)}&token=${encodeURIComponent(rawCredentials.token)}`;
        ShowToast("success", "Invitation confirmed successfully!");
      } catch {
        ShowToast("error", "Failed to accept invitation. Please try again.");
      } finally {
        setConfirming(false);
      }
    },
  });

  const handleReject = async () => {
    try {
      setRejecting(true);

      const updateInvitation = await rpc.api["users-invitations"].update[
        ":id"
      ].$patch({
        param: { id: invitationId },
        json: {
          status: "rejected",
        },
      });

      if (!updateInvitation.ok) {
        throw new Error("Failed to update invitation");
      }

      ShowToast("success", "Invitation rejected successfully!");
      window.location.href = "/login";
    } catch {
      ShowToast("error", "Failed to reject invitation. Please try again.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <form
      className="grid grid-cols-1 gap-4 w-screen px-4 md:w-md"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-3 mb-4">
        <SubLogo />
        <p className="text-4xl text-center">Confirm your Invitation</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-center">Confirming as</p>
          <form.Field name="email">
            {(field) => (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="text-center"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
          <p className="text-sm text-muted-foreground text-center">
            This email address has been pre-filled from your invitation. Please
            confirm that it is correct before proceeding. If the email looks
            incorrect or has been tampered with, do not continue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          className="w-full"
          variant="destructive"
          disabled={isRejecting}
          onClick={handleReject}
        >
          {isRejecting ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "Reject"
          )}
        </Button>

        <Button type="submit" className="w-full" disabled={isConfirming}>
          {isConfirming ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </form>
  );
}
