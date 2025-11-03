import UpdateContentLayout from "@/components/layout/update-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { type ActionType } from "@/hooks/use-action-dialog";
import { useReviewChangesStore } from "@/store/review-changes-store";
import type { ActionsTypeManagement } from "@binspire/shared";

const ACTION_KEY: ActionType = "update";

interface Props {
  queryKey: ActionsTypeManagement;
  actionKey?: ActionType;
  formId: string;
}

export function UpdateEntity({ queryKey, formId }: Props) {
  const { prevValue, newValue } = useReviewChangesStore();

  return (
    <ActionDialogContainer keys={{ queryKey, actionKey: ACTION_KEY }}>
      <UpdateContentLayout
        formId={formId}
        queryKey={queryKey}
        prevValues={prevValue}
        newValues={newValue}
      />
    </ActionDialogContainer>
  );
}
