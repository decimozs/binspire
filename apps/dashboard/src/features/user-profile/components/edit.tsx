import { type User, useUpdateUser } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { Input } from "@binspire/ui/components/input";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import z from "zod";
import { ShowToast } from "@/components/core/toast-notification";

interface Props {
  data: User;
  handleCancelEdit: () => void;
}

const userEditFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.email(),
});

export default function UserEditForm({ data, handleCancelEdit }: Props) {
  const updateUser = useUpdateUser();
  const form = useForm({
    defaultValues: {
      name: data.name,
      email: data.email,
    },
    validators: {
      onSubmit: userEditFormSchema,
      onBlur: userEditFormSchema,
      onChange: userEditFormSchema,
    },
    onSubmit: async ({ value }) => {
      await updateUser.mutateAsync({ id: data.id, data: value });
      ShowToast("success", "User profile updated successfully");
      handleCancelEdit();
    },
  });

  return (
    <form
      className="flex flex-col gap-4 w-[400px]"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col gap-2 w-full">
        <p>Name</p>
        <form.Field name="name">
          {(field) => (
            <>
              <Input
                field={field}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full"
              />
              <FormFieldError field={field} />
            </>
          )}
        </form.Field>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p>Email</p>
        <form.Field name="email">
          {(field) => (
            <>
              <Input
                field={field}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full"
              />
              <FormFieldError field={field} />
            </>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-row gap-2 items-center">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
          <Button size="sm" type="submit" disabled={updateUser.isPending}>
            {updateUser.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
