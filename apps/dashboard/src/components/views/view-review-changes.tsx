import { useGetAuditById } from "@binspire/query";
import type { ActionsTypeManagement, AuditActions } from "@binspire/shared";
import { AuditActionBadge } from "@binspire/ui/badges";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@binspire/ui/components/dialog";
import { parseAsBoolean, useQueryState } from "nuqs";
import CreatedData from "@/features/audits/components/created-data";
import DeletedData from "@/features/audits/components/deleted-data";
import {
  type ActionType as ActionTypeKey,
  useActionDialog,
} from "@/hooks/use-action-dialog";
import ComparedChanges from "../core/compared-changes";

const keys: { queryKey: ActionsTypeManagement; actionKey: ActionTypeKey } = {
  queryKey: "activityManagement",
  actionKey: "review",
};

const actionDescriptions: Record<string, string> = {
  create: "A new record was added. Review the created data for accuracy.",
  update:
    "This record was modified. Review the changes carefully to ensure they are correct.",
  delete:
    "A record was removed. Review the deleted data for compliance and integrity.",
};

export default function ViewReviewChanges() {
  const { queryId, open, handleClose } = useActionDialog(keys);
  const { data } = useGetAuditById(queryId!);
  const prevValues = data?.changes.before || {};
  const newValues = data?.changes.after || {};
  const action = data?.action;
  const [, setCreateIssue] = useQueryState(
    "is_creating_issue",
    parseAsBoolean.withDefault(false),
  );

  const description =
    (action && actionDescriptions[action]) ||
    "Audit logs indicate recent modifications to this record. Review the logged changes to ensure compliance and integrity.";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        className={action === "update" ? "w-[900px]" : "w-[600px]"}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row gap-2 items-center">
              <p>Review Changes</p>
              <AuditActionBadge action={data?.action as AuditActions} />
            </div>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {action === "update" && (
          <ComparedChanges prevValues={prevValues} newValues={newValues} />
        )}
        {action === "delete" && <DeletedData deletedValues={prevValues} />}
        {action === "create" && <CreatedData createdValues={newValues} />}
        <div className="flex justify-end items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setCreateIssue(true)}>
            Create Issue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
