import type { ActionsTypeManagement } from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import { Input } from "@binspire/ui/components/input";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { useActionDialog } from "@/hooks/use-action-dialog";
import ComparedChanges from "../core/compared-changes";

interface UpdateContentLayoutProps<T> {
  queryKey: ActionsTypeManagement;
  formId: string;
  prevValues: T;
  newValues: T;
}

const confirmUpdateSchema = z.object({
  confirmationText: z.literal("update data"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function UpdateContentLayout<T extends Record<string, any>>({
  queryKey,
  formId,
  prevValues,
  newValues,
}: UpdateContentLayoutProps<T>) {
  const { removeAction } = useActionDialog({ queryKey, actionKey: "update" });
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    defaultValues: {
      confirmationText: "",
    },
    validators: {
      onSubmit: confirmUpdateSchema,
      onBlur: confirmUpdateSchema,
      onChange: confirmUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsPending(true);

        if (value.confirmationText === "update data") {
          const form = document.getElementById(formId) as HTMLFormElement;

          if (form) {
            form.requestSubmit();
          }

          await new Promise((resolve) => setTimeout(resolve, 400));
          removeAction("update");
        }
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      Review Changes
      <ComparedChanges prevValues={prevValues} newValues={newValues} />
      <form
        id={formId}
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
                  placeholder="Type 'update data'"
                  type="text"
                  field={field}
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
            onClick={() => removeAction("update")}
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
                disabled={
                  isPending ||
                  !canSubmit ||
                  form.state.values.confirmationText === ""
                }
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
