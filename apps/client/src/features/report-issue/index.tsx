import { Button } from "@binspire/ui/components/button";
import { Input } from "@binspire/ui/components/input";
import { Textarea } from "@binspire/ui/components/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import {
  formatLabel,
  ISSUE_STATUSES,
  PRIORITY_SCORES,
  PRIORITY_SCORES_CONFIG,
  SYSTEM_ENTITY,
  type PriorityScores,
} from "@binspire/shared";
import { Info, Loader2, Ticket } from "lucide-react";
import { insertIssueSchema } from "@binspire/db/schema";
import { useCreateIssue } from "@binspire/query";
import { useForm } from "@tanstack/react-form";
import { ShowToast } from "@/components/toast";
import { useState } from "react";
import { authClient } from "../auth";
import { FormFieldError } from "@binspire/ui/forms";
import z from "zod";
import { useMqtt } from "@/context/mqtt-provider";
import SettingsItem from "../settings/components/settings-item";

const schema = insertIssueSchema
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
      .min(10, "Title must be at least 10 characters long.")
      .max(100, "Title must not exceed 100 characters."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long.")
      .max(1000, "Description must not exceed 1000 characters."),
  });

export default function ReportIssue({
  entity,
  label = "Report Issue",
  settings,
}: {
  settings?: boolean;
  entity: (typeof SYSTEM_ENTITY)[number];
  label: string;
}) {
  const action = useCreateIssue();
  const { mutateAsync, isPending } = action;
  const { data: currentSession } = authClient.useSession();
  const user = currentSession?.user;
  const [open, setOpen] = useState(false);
  const { client } = useMqtt();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "low" as (typeof PRIORITY_SCORES)[number],
      status: "open" as (typeof ISSUE_STATUSES)[number],
      entity,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const issue = await mutateAsync({
          data: {
            userId: user?.id as string,
            orgId: user?.orgId as string,
            ...value,
          },
        });

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

        formApi.reset();
        setOpen(false);
        ShowToast("success", "Issue created successfully");
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
    <Sheet open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <SheetTrigger asChild>
        {settings ? (
          <div className="grid grid-cols-1 gap-4">
            <p className="text-2xl font-bold">Report</p>
            <SettingsItem
              label="Submit a ticket"
              description="Report a bug or issue you're experiencing."
              icon={Ticket}
            />
          </div>
        ) : (
          <Button variant="destructive">
            <Info />
          </Button>
        )}
      </SheetTrigger>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <SheetContent className="w-full font-bold">
          <SheetHeader>
            <SheetTitle className="text-4xl">{label}</SheetTitle>
            <SheetDescription>
              Please provide details about the issue you encountered with this
              trashbin. Your feedback helps us improve our services.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 grid grid-cols-1 gap-4 -mt-5">
            <div className="flex flex-col gap-2">
              <p>Title</p>
              <form.Field name="title">
                {(field) => (
                  <>
                    <Input
                      placeholder="What is your issue?"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                    />
                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
              <p className="text-muted-foreground text-sm">
                A brief title summarizing the issue.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>Description</p>
              <form.Field name="description">
                {(field) => (
                  <>
                    <Textarea
                      placeholder="Please describe your issue"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                    />
                    <FormFieldError field={field} />
                  </>
                )}
              </form.Field>
              <p className="text-muted-foreground text-sm">
                A detailed description of the problem you are reporting.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>Priority Score</p>
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
                        className="w-full min-h-12"
                        disabled={isPending}
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
              <p className="text-muted-foreground text-sm">
                Indicates the urgency of addressing the reported issue.
              </p>
            </div>
          </div>
          <SheetFooter>
            <Button
              type="submit"
              className="font-bold text-lg w-full"
              disabled={isPending}
              onClick={() => form.handleSubmit()}
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </form>
    </Sheet>
  );
}
