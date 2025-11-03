import { ShowToast } from "@/components/core/toast-notification";
import { useEditDialog } from "@/hooks/use-edit-dialog";
import { useUpdateIssue, type Issue } from "@binspire/query";
import {
  formatCamelCase,
  ISSUE_STATUS_CONFIG,
  ISSUE_STATUSES,
  PRIORITY_SCORES,
  PRIORITY_SCORES_CONFIG,
  type IssueStatus,
  type PriorityScores,
} from "@binspire/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm, useStore } from "@tanstack/react-form";
import z from "zod";

const editModeSchema = z.object({
  status: z.enum(ISSUE_STATUSES),
  priority: z.enum(PRIORITY_SCORES),
});

export default function EditIssue({
  data,
  formId,
}: {
  data: Issue;
  formId: string;
}) {
  const updateIssue = useUpdateIssue();
  const form = useForm({
    defaultValues: {
      status: data.status,
      priority: data.priority,
    },
    validators: {
      onSubmit: editModeSchema,
      onBlur: editModeSchema,
      onChange: editModeSchema,
    },
    onSubmit: async ({ value }) => {
      await updateIssue.mutateAsync({ id: data.id, data: value });
      ShowToast("success", "Issue updated successfully");
      handleResetEditState();
    },
  });
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const updatedValues = useStore(form.store, (state) => state.values);
  const { handleResetEditState } = useEditDialog<Issue>({
    defaultValues: data,
    updatedValues,
    isFormChange: isDefaultValue,
  });

  return (
    <form
      id={formId}
      className="flex flex-col gap-3 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <p className="text-muted-foreground">Details</p>
      <div className="flex flex-col text-sm gap-1">
        <p>Title</p>
        <p className="text-muted-foreground">{data.title}</p>
      </div>

      <div className="flex flex-col text-sm gap-1">
        <p>Description</p>
        <p className="text-muted-foreground border-[1px] rounded-md p-3 mt-1">
          {data.description}
        </p>
      </div>

      <div className="flex flex-col text-sm gap-1">
        <p>Entity</p>
        <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
          {formatCamelCase(data.entity)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col text-sm gap-1 w-full">
          <p>Status</p>
          <form.Field name="status">
            {(field) => (
              <>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.setValue(val as IssueStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ISSUE_STATUS_CONFIG).map(([key, value]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        onSelect={() => field.setValue(key as IssueStatus)}
                      >
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col text-sm gap-1 w-full">
          <p>Priority</p>
          <form.Field name="priority">
            {(field) => (
              <>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.setValue(val as PriorityScores)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_SCORES_CONFIG).map(
                      ([key, value]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          onSelect={() => field.setValue(key as PriorityScores)}
                        >
                          {value.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>
      </div>
    </form>
  );
}
