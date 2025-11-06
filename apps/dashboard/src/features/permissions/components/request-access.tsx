import { Button } from "@binspire/ui/components/button";
import { Textarea } from "@binspire/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
import { Key, Loader2, Plus } from "lucide-react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
import { ShowToast } from "@/components/core/toast-notification";
import { useState } from "react";
import type { ModuleActions } from "@binspire/shared";
import { useCreateUserRequest } from "@binspire/query";
import { FormFieldError } from "@binspire/ui/forms";

interface RequestAccessProps {
  actions?: ModuleActions;
}

const requestAccessFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function RequestAccess({ actions }: RequestAccessProps) {
  const createRequest = useCreateUserRequest();
  const currentSession = authClient.useSession();
  const [open, setOpen] = useState(false);

  const isViewMode =
    actions?.read === true &&
    actions?.create !== true &&
    actions?.update !== true &&
    actions?.delete !== true;
  const canCreate = actions?.create;
  const canRead = actions?.read;
  const canUpdate = actions?.update;
  const canDelete = actions?.delete;
  const isFullGranted = canCreate && canRead && canUpdate && canDelete;

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: requestAccessFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await createRequest.mutateAsync({
        ...value,
        type: "access_request",
        userId: currentSession.data?.user.id as string,
      });

      formApi.reset();
      ShowToast("success", "Your request has been submitted successfully.");
      setOpen(false);
    },
  });

  return (
    <div className="relative">
      <div className="absolute top-4 right-0 flex flex-row items-center gap-4">
        {isViewMode && (
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm text-muted-foreground border-md border-[1px] border-accent px-3 py-1 rounded-md border-yellow-400/20 bg-yellow-400/10 p-4 text-yellow-600">
              Currently in viewer mode
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Key />
                  Request Access
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  action=""
                  className="w-fit"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Request Access</DialogTitle>
                    <DialogDescription>
                      Request additional permissions to enhance your access and
                      capabilities within the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <p>Title</p>
                      <form.Field name="title">
                        {(field) => (
                          <>
                            <Input
                              type="text"
                              placeholder="Title of your request"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              field={field}
                              disabled={createRequest.isPending}
                            />
                            <FormFieldError field={field} />
                          </>
                        )}
                      </form.Field>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <p>Description</p>
                      <form.Field name="description">
                        {(field) => (
                          <>
                            <Textarea
                              placeholder="What and why are you requesting"
                              className="w-full min-h-[90px]"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={createRequest.isPending}
                            />
                            <FormFieldError field={field} />
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>

                  <Button
                    className="mt-4 w-full"
                    type="submit"
                    size="lg"
                    disabled={createRequest.isPending}
                  >
                    {createRequest.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Request"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {!isViewMode && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground text-center">
              Permissions
            </p>
            <div className="flex flex-row items-center gap-2">
              {canCreate && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="green-badge">
                      <p>C</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-row gap-2 items-center font-bold">
                    <p>
                      Allows the user to create new records or items in the
                      system.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {canRead && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="yellow-badge">
                      <p>R</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-row gap-2 items-center font-bold">
                    <p>
                      Allows the user to view or read and access existing
                      records or items.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {canUpdate && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="blue-badge">
                      <p>U</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-row gap-2 items-center font-bold">
                    <p>
                      Allows the user to modify or update existing records or
                      items.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {canDelete && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="red-badge">
                      <p>D</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-row gap-2 items-center font-bold">
                    <p>
                      Allows the user to remove or permanently delete records or
                      items.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {!isFullGranted && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8">
                      <Plus />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form
                      action=""
                      className="w-fit"
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Request Access</DialogTitle>
                        <DialogDescription>
                          Request additional permissions to enhance your access
                          and capabilities within the system.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <p>Title</p>
                          <form.Field name="title">
                            {(field) => (
                              <>
                                <Input
                                  type="text"
                                  placeholder="Title of your request"
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  field={field}
                                  disabled={createRequest.isPending}
                                />
                                <FormFieldError field={field} />
                              </>
                            )}
                          </form.Field>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <p>Description</p>
                          <form.Field name="description">
                            {(field) => (
                              <>
                                <Textarea
                                  placeholder="What and why are you requesting"
                                  className="w-full min-h-[90px]"
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  disabled={createRequest.isPending}
                                />
                                <FormFieldError field={field} />
                              </>
                            )}
                          </form.Field>
                        </div>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        type="submit"
                        size="lg"
                        disabled={createRequest.isPending}
                      >
                        {createRequest.isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Request"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
