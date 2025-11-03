import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Loader2 } from "lucide-react";
import type { DialogProps } from "@/lib/types";

interface Props {
  isPending: boolean;
}

export default function SaveChanges<T extends Props>({
  action,
  ...props
}: DialogProps<T>) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="w-fit"
          type="button"
          disabled={props.disabled}
          size="sm"
        >
          Save Changes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save your changes?</DialogTitle>
          <DialogDescription>
            You’re about to update your settings. These updates will take effect
            immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => props.onOpenChange?.(false)}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={action.isPending}
            type="submit"
            form={props.id}
            size="sm"
          >
            {action.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
