import z from "zod";
import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@binspire/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { useEditDialog } from "@/hooks/use-edit-dialog";
import { ShowToast } from "@/components/core/toast-notification";
import { FormFieldError } from "@binspire/ui/forms";
import { WASTE_TYPE_CONFIG } from "@binspire/shared";
import { useUpdateTrashbin, type Trashbin } from "@binspire/query";

const editModeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  wasteType: z.enum(
    Object.keys(WASTE_TYPE_CONFIG) as [keyof typeof WASTE_TYPE_CONFIG],
  ),
});

export default function EditTrashbin({
  formId,
  data,
}: {
  formId: string;
  data: Trashbin;
}) {
  const updateData = useUpdateTrashbin();
  const form = useForm({
    defaultValues: {
      name: data.name,
      location: data.location,
      wasteType: data.wasteType,
    },
    validators: {
      onSubmit: editModeSchema,
      onBlur: editModeSchema,
      onChange: editModeSchema,
    },
    onSubmit: async ({ value }) => {
      await updateData.mutateAsync({ id: data.id, data: value });
      ShowToast("success", "Trashbin updated successfully");
      handleResetEditState();
    },
  });
  const isDefaultValue = useStore(form.store, (state) => state.isDefaultValue);
  const updatedValues = useStore(form.store, (state) => state.values);
  const { handleResetEditState } = useEditDialog<Trashbin>({
    defaultValues: data,
    updatedValues,
    isFormChange: isDefaultValue,
  });

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col gap-2">
        <p>Name</p>
        <form.Field name="name">
          {(field) => (
            <>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                field={field}
              />
              <FormFieldError field={field} />
            </>
          )}
        </form.Field>
      </div>

      <div className="flex flex-col gap-2">
        <p>Location</p>
        <form.Field name="location">
          {(field) => (
            <>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                field={field}
              />
              <FormFieldError field={field} />
            </>
          )}
        </form.Field>
      </div>

      <div className="flex flex-col gap-2">
        <p>Waste Type</p>
        <form.Field name="wasteType">
          {(field) => (
            <>
              <Select
                value={field.state.value}
                onValueChange={(val) => field.setValue(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WASTE_TYPE_CONFIG).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      onSelect={() => field.setValue(key)}
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
    </form>
  );
}
