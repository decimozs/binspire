import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserConfirmation } from "../shared/user-confirmation";
import { Button } from "../ui/button";
import { useFetcher } from "react-router";
import type { User } from "@/lib/types";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";
import { updateUserFetcher } from "@/routes/resource/users.resource";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

export const UpdateUser = ({ user }: { user: User }) => {
  const userId = user.id;
  const componentKey = "update-user";
  const fetcher = updateUserFetcher(componentKey, userId);
  const isSubmitting = fetcher.state === "submitting";
  const actionData = fetcher.data;
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateUserProfile, setUpdateUserProfile] = useQueryState(
    "update_user_profile",
  );

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Successfully updated your user profile", {
        action: {
          label: "Close",
          onClick: () => console.log("hello"),
        },
      });
      setUpdateUserProfile(null);
    }
  }, [actionData]);

  const handleUpdateUser = () => {
    const userName = inputRef.current?.value || user.name;
    fetcher.submit({ name: userName });
  };

  const handleCloseDialog = () => {
    setUpdateUserProfile(null);
  };

  return (
    <Dialog
      open={!!updateUserProfile}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" onClick={() => setUpdateUserProfile("true")}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your profile</DialogTitle>
          <DialogDescription>
            You're about to upadate your user profile from the system.
          </DialogDescription>
        </DialogHeader>
        <UserConfirmation
          name={user.name}
          image={user.image as string}
          role={user.role}
        />
        <div className="flex flex-col gap-2">
          <div>
            <DialogTitle className="text-sm">Name</DialogTitle>
          </div>
          <Input
            ref={inputRef}
            className="h-12 p-4"
            defaultValue={user.name}
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleUpdateUser}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
