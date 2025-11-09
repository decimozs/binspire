import { insertIssueSchema } from "@binspire/db/schema";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@binspire/ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@binspire/ui/components/command";
import { Textarea } from "@binspire/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { useForm } from "@tanstack/react-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { cn } from "@binspire/ui/lib/utils";
import { ShowToast } from "@/components/core/toast-notification";
import { useCreateIssue } from "@binspire/query";
import {
  ENTITY_DATA_VALUE,
  formatLabel,
  ISSUE_STATUS_CONFIG,
  PRIORITY_SCORES_CONFIG,
  type ISSUE_STATUSES,
  type IssueStatus,
  type PRIORITY_SCORES,
  type PriorityScores,
  type SYSTEM_ENTITY,
} from "@binspire/shared";
import { FormFieldError } from "@binspire/ui/forms";
import z from "zod";
import { useMqtt } from "@/hooks/use-mqtt";

export const issueFormSchema = insertIssueSchema
  .pick({
    title: true,
    description: true,
    priority: true,
    status: true,
    entity: true,
  })
  .required({
    entity: true,
    priority: true,
    status: true,
  })
  .extend({
    title: z
      .string()
      .min(10, "Title must be at least 3 characters long.")
      .max(100, "Title must not exceed 100 characters."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long.")
      .max(1000, "Description must not exceed 1000 characters."),
  });

export default function CreateIssue() {
  const [createIssue, setCreateIssue] = useQueryState(
    "is_creating_issue",
    parseAsBoolean.withDefault(false),
  );
  const createAction = useCreateIssue();
  const { data: currentSession } = authClient.useSession();
  const user = currentSession?.user;
  const [open, setOpen] = useState(false);
  const { client } = useMqtt();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium" as (typeof PRIORITY_SCORES)[number],
      status: "open" as (typeof ISSUE_STATUSES)[number],
      entity: "activityManagement" as (typeof SYSTEM_ENTITY)[number],
    },
    validators: {
      onSubmit: issueFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const issue = await createAction.mutateAsync({
          data: {
            userId: user?.id as string,
            orgId: user?.orgId as string,
            ...value,
          },
        });
        ShowToast("success", "Issue created successfully");
        setCreateIssue(false);

        client?.publish(
          "issues",
          JSON.stringify({
            title: `Issue #${issue.no}`,
            description: `You have new issue from ${formatLabel(issue.entity)} that has a priority score of ${issue.priority}.`,
            timestamp: issue.createdAt,
            userId: issue.userId,
            key: "issueManagement_actionDialog",
            url: {
              type: "issueManagement",
              id: issue.id,
              action: ["view"],
            },
          }),
        );
      } catch (error) {
        const err = error as Error;
        ShowToast(
          "error",
          err.message || "Failed to create issue. Please try again.",
        );
      }
    },
  });

  return (
    <Dialog
      open={createIssue}
      onOpenChange={(isOpen) => setCreateIssue(isOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Issue</DialogTitle>
          <DialogDescription>
            Fill out the details for your new issue. Once created, it will
            appear in the issues list.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid grid-cols-1 gap-4"
        >
          <div className="flex flex-col text-sm gap-1 w-full">
            <p>Title</p>
            <form.Field name="title">
              {(field) => (
                <>
                  <Input
                    placeholder="What is your issue?"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={createAction.isPending}
                  />
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <div className="flex flex-col text-sm gap-1 w-full">
            <p>Description</p>
            <form.Field name="description">
              {(field) => (
                <>
                  <Textarea
                    placeholder="Please describe your issue"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={createAction.isPending}
                  />
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col text-sm gap-1 w-full">
              <p>Status</p>
              <form.Field name="status">
                {(field) => (
                  <>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.setValue(val as IssueStatus)
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        disabled={createAction.isPending}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ISSUE_STATUS_CONFIG).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
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

            <div className="flex flex-col text-sm gap-1 w-full">
              <p>Priority</p>
              <form.Field name="priority">
                {(field) => (
                  <>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.setValue(val as PriorityScores)
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        disabled={createAction.isPending}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_SCORES_CONFIG).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
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

          <div className="flex flex-col text-sm gap-1 w-full">
            <p>Entity</p>
            <form.Field name="entity">
              {(field) => (
                <>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={createAction.isPending}
                      >
                        {field.state.value
                          ? ENTITY_DATA_VALUE.find(
                              (e) => e.value === field.state.value,
                            )?.label
                          : "Select entity..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0"
                      side="bottom"
                      align="start"
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Search entity..."
                          className="h-9"
                        />
                        <CommandList className="w-full">
                          <CommandEmpty>No entity found.</CommandEmpty>
                          <CommandGroup className="w-full">
                            {ENTITY_DATA_VALUE.map((entity) => (
                              <CommandItem
                                key={entity.value}
                                value={entity.value}
                                onSelect={(currentValue) => {
                                  field.setValue(
                                    currentValue as typeof field.state.value,
                                  );
                                  setOpen(false);
                                }}
                                className="w-full"
                              >
                                {entity.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.state.value === entity.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <Button
            type="submit"
            size="sm"
            className="w-full"
            disabled={createAction.isPending}
          >
            {createAction.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Issue"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
