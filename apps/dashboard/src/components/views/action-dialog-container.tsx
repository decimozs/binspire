import { useActionDialog, type ActionType } from "@/hooks/use-action-dialog";
import {
  ACTION_DIALOG_CONFIG,
  type ActionsTypeManagement,
} from "@binspire/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@binspire/ui/components/dialog";
import type { ReactNode } from "react";

interface Keys {
  queryKey: ActionsTypeManagement;
  actionKey: ActionType;
}

interface ActionDialogContainerProps {
  children: ReactNode;
  keys: Keys;
}

export default function ActionDialogContainer({
  children,
  keys,
}: ActionDialogContainerProps) {
  const { open, handleClose, editMode } = useActionDialog(keys);
  const { queryKey, actionKey } = keys;
  const title =
    actionKey === "view"
      ? (ACTION_DIALOG_CONFIG[queryKey].view?.title as string)
      : actionKey === "update"
        ? (ACTION_DIALOG_CONFIG[queryKey].update?.title as string)
        : (ACTION_DIALOG_CONFIG[queryKey].delete?.title as string);
  const description =
    actionKey === "view"
      ? (ACTION_DIALOG_CONFIG[queryKey].view?.description as string)
      : actionKey === "update"
        ? (ACTION_DIALOG_CONFIG[queryKey].update?.description as string)
        : (ACTION_DIALOG_CONFIG[queryKey].delete?.description as string);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        className={
          actionKey === "delete"
            ? "w-[450px]"
            : actionKey === "update"
              ? "max-w-[700px]"
              : ""
        }
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row items-center gap-2">
              <p>{title}</p>
              {actionKey !== "update" && actionKey !== "delete" && (
                <div
                  className={`text-xs border-md border-[1px] border-accent px-2 py-0.5 rounded-md ${
                    !editMode
                      ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-600"
                      : "border-blue-400/20 bg-blue-400/10 text-blue-600"
                  }`}
                >
                  <p>{!editMode ? "Read only" : "Edit mode"}</p>
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
