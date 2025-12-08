import { useGetMaintenanceById, useUpdateMaintenance } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import { Textarea } from "@binspire/ui/components/textarea";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { DateAndTimePicker } from "@/components/core/appointment-picker";
import { ShowToast } from "@/components/core/toast-notification";
import { authClient } from "@/lib/auth-client";
import { usePermissionStore } from "@/store/permission-store";

const schema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().max(200),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export default function MaintenanceMode() {
  const { permission } = usePermissionStore();
  const configureMaintenance = useUpdateMaintenance();
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const orgId = session?.user.orgId;
  const currentMaintenance = useGetMaintenanceById(orgId!);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    },

    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        await configureMaintenance.mutateAsync({
          id: orgId!,
          data: {
            title: value.title,
            isInMaintenance: true,
            description: value.description,
            startTime: value.startTime,
            endTime: value.endTime,
          },
        });

        form.reset();
        ShowToast("success", "Maintenance mode enabled successfully");
      } catch (err) {
        const error = err as Error;
        ShowToast(
          "error",
          error.message || "Failed to enable maintenance mode",
        );
      }
    },
  });

  const hasPermission = permission.settingsManagement?.actions.update;

  const handleDisableMaintenanceMode = async () => {
    await configureMaintenance.mutateAsync({
      id: orgId!,
      data: {
        title: "",
        isInMaintenance: false,
        description: "",
        startTime: "",
        endTime: "",
      },
    });
    setOpen(false);
  };

  if (currentMaintenance.data?.isInMaintenance) {
    return (
      <div className="flex flex-col gap-2 w-md">
        <p>Maintenance Mode</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              variant="destructive"
              type="button"
              disabled={!hasPermission}
            >
              Disable Maintenance Mode
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable Maintenance Mode</DialogTitle>
              <DialogDescription>
                Disabling maintenance mode will restore access to the system for
                all users. Ensure that all updates or changes are complete
                before proceeding.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleDisableMaintenanceMode}
                disabled={configureMaintenance.isPending}
              >
                {configureMaintenance.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <p className="text-sm text-muted-foreground">
          The system is currently in maintenance mode. Disable maintenance mode
          to restore user access.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-md">
      <p>Maintenance Mode</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            type="button"
            variant="destructive"
            disabled={!hasPermission}
          >
            Create Maintenance
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[700px]">
          <DialogHeader>
            <DialogTitle>Maintenance</DialogTitle>
            <DialogDescription>
              Enable maintenance mode to temporarily restrict user access.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm">Title</p>
              <form.Field name="title">
                {(field) => (
                  <>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter your title"
                        className="w-full"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        field={field}
                      />
                    </div>

                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <div className="flex flex-col text-sm gap-2 w-full">
              <p>Description</p>
              <form.Field name="description">
                {(field) => (
                  <>
                    <Textarea
                      placeholder="Cause of maintenance mode"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 mt-4 justify-items-center">
              <div className="flex flex-col gap-2">
                <p>Starting Time</p>
                <div className="flex flex-col gap-2 items-center justify-center border-[1px] border-accent rounded-md w-fit p-4 border-dashed">
                  <form.Field name="startTime">
                    {(field) => (
                      <>
                        <DateAndTimePicker
                          value={field.state.value}
                          onChange={(val) => field.handleChange(val)}
                        />
                        <FormFieldError field={field} />
                      </>
                    )}
                  </form.Field>
                </div>
                <p className="text-sm text-muted-foreground">
                  When maintenance mode will be enabled
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Ending Time</p>
                <div className="flex flex-col gap-2 items-center justify-center border-[1px] border-accent rounded-md w-fit p-4 border-dashed">
                  <form.Field name="endTime">
                    {(field) => (
                      <>
                        <DateAndTimePicker
                          value={field.state.value}
                          onChange={(val) => field.handleChange(val)}
                        />
                        <FormFieldError field={field} />
                      </>
                    )}
                  </form.Field>
                </div>
                <p className="text-sm text-muted-foreground">
                  When maintenance mode will be disabled
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                disabled={configureMaintenance.isPending}
              >
                {configureMaintenance.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Enable maintenance"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p className="text-sm text-muted-foreground">
        Temporarily disable user access to the system for maintenance or
        updates.
      </p>
    </div>
  );
}
