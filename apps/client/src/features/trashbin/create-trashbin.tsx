import MainLayout from "@/components/layout/main-layout";
import { Input } from "@binspire/ui/components/input";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { WASTE_TYPE_CONFIG } from "@binspire/shared";
import { FormFieldError } from "@binspire/ui/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { Button } from "@binspire/ui/components/button";
import { QRCodeApi, useCreateTrashbin, useDeleteQRCode } from "@binspire/query";
import { useSession } from "../auth";
import { Loader2 } from "lucide-react";
import { ShowToast } from "@/components/toast";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  department: z.string().min(1, "Department is required"),
  wasteType: z.enum(
    Object.keys(WASTE_TYPE_CONFIG) as [keyof typeof WASTE_TYPE_CONFIG],
  ),
  orgId: z.string().min(1, "Organization ID is required"),
});

export default function CreateTrashbin({ secret }: { secret: string }) {
  const createData = useCreateTrashbin();
  const deleteQrCode = useDeleteQRCode();
  const navigate = useNavigate();
  const { data: currentSession } = useSession();
  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
      department: "",
      wasteType: "recyclable",
      orgId: currentSession?.user.orgId!,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value, formApi }) => {
      await createData.mutateAsync({ data: value });
      formApi.reset();
      const verifyQrCode = await QRCodeApi.getBySecret(secret);
      await deleteQrCode.mutateAsync(verifyQrCode.id);
      ShowToast("success", "Trashbin created successfully");
      navigate({ to: "/services" });
    },
  });

  return (
    <MainLayout>
      <form
        className="grid grid-cols-1 gap-4"
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
                  disabled={createData.isPending || deleteQrCode.isPending}
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
                  disabled={createData.isPending || deleteQrCode.isPending}
                />
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col gap-2">
          <p>Department</p>
          <form.Field name="department">
            {(field) => (
              <>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  field={field}
                  disabled={createData.isPending || deleteQrCode.isPending}
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
                  <SelectTrigger
                    className="w-full min-h-12"
                    disabled={createData.isPending || deleteQrCode.isPending}
                  >
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

        <Button type="submit" disabled={createData.isPending}>
          {createData.isPending || deleteQrCode.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </MainLayout>
  );
}
