import type { ModuleActions } from "@binspire/shared";
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
import { Input } from "@binspire/ui/components/input";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import type { Table } from "@tanstack/react-table";
import { Loader2, X } from "lucide-react";
import z from "zod";
import { ShowToast } from "@/components/core/toast-notification";
import WarningSign from "@/components/sign/warnings";

interface TDataWithId {
  id: string;
}

interface Props<TData extends TDataWithId> {
  selectedData: TData[];
  table: Table<TData>;
  useDeleteBatchHook: () => {
    mutateAsync: (data: string[]) => Promise<unknown>;
    isPending: boolean;
  };
  actions: ModuleActions | undefined;
}

const confirmDeletionSchema = z.object({
  confirmationText: z.literal("permanently delete"),
});

export default function SelectedDataActions<TData extends TDataWithId>({
  selectedData,
  table,
  useDeleteBatchHook,
  actions,
}: Props<TData>) {
  const handleClearSelection = () => {
    table.resetRowSelection();
  };

  const batchDelete = useDeleteBatchHook();
  const isPending = batchDelete.isPending;

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
        const selectedIds = selectedData.map((item) => item.id);
        await batchDelete.mutateAsync(selectedIds);
        handleClearSelection();
        ShowToast("success", "Data deleted successfully");
      }
    },
  });

  const hasPermission = actions?.delete;

  if (selectedData.length === 1) return null;

  if (!hasPermission) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background">
        <WarningSign
          iconClassName="size-5"
          message="You have no permission to do any actions in this data."
          className="text-sm"
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 border-[1px] rounded-md py-2 px-4 bg-background">
      <div className="flex flex-row items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-[200px]">
              Delete All
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Delete selected data?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The selected{" "}
                  {selectedData.length === 1 ? "data" : "datas"} will be
                  permanently removed from your system and will no longer be
                  accessible.
                </DialogDescription>
              </DialogHeader>
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
                      />
                      <FormFieldError field={field} />
                    </>
                  )}
                </form.Field>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                  >
                    Close
                  </Button>
                </DialogClose>
                <form.Subscribe
                  selector={(state) => [state.canSubmit]}
                  children={([canSubmit]) => (
                    <Button
                      size="sm"
                      type="submit"
                      disabled={
                        !canSubmit || form.state.values.confirmationText === ""
                      }
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  )}
                />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <div
          className="border-[1px] rounded-full h-7 w-7 flex items-center justify-center"
          onClick={handleClearSelection}
        >
          <X size={15} />
        </div>
      </div>
    </div>
  );
}
