import { useActionDialog } from "@/hooks/use-action-dialog";
import z from "zod";
import { ShowToast } from "../core/toast-notification";
import { useForm } from "@tanstack/react-form";
import { Input } from "@binspire/ui/components/input";
import { Button } from "@binspire/ui/components/button";
import { Loader2 } from "lucide-react";
import type { ActionsTypeManagement } from "@binspire/shared";
import { FormFieldError } from "@binspire/ui/forms";

interface DeleteContentLayoutProps {
  queryId: string;
  queryKey: ActionsTypeManagement;
  onDelete: (id: string) => void;
  isPending: boolean;
}

const confirmDeletionSchema = z.object({
  confirmationText: z.literal("permanently delete"),
});

export default function DeleteContentLayout({
  queryId,
  queryKey,
  onDelete,
  isPending,
}: DeleteContentLayoutProps) {
  const { removeAction, clearAll } = useActionDialog({
    queryKey,
    actionKey: "delete",
  });

  const form = useForm({
    defaultValues: {
      confirmationText: "",
    },
    validators: {
      onSubmit: confirmDeletionSchema,
      onBlur: confirmDeletionSchema,
      onChange: confirmDeletionSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.confirmationText === "permanently delete") {
        onDelete(queryId);
        ShowToast("success", "Data deleted successfully");
        clearAll();
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Field name="confirmationText">
          {(field) => (
            <>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Type 'permanently delete'"
                type="text"
                field={field}
                disabled={isPending}
              />
              <FormFieldError field={field} />
            </>
          )}
        </form.Field>
      </div>
      <div className="flex flex-row items-center gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeAction("delete")}
          type="button"
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit]}
          children={([canSubmit]) => (
            <Button
              size="sm"
              type="submit"
              disabled={!canSubmit || form.state.values.confirmationText === ""}
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
