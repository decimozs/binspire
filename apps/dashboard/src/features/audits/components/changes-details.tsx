import type { Audit } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { ArrowRight, File, Trash } from "lucide-react";
import ComparedChanges from "@/components/core/compared-changes";

function ViewDeletedData() {
  return (
    <>
      <div className="border-[1px] border-dashed rounded-md p-4 flex items-center justify-center">
        <div className="flex flex-row items-center gap-4">
          <File />
          <ArrowRight size={15} />
          <Trash />
        </div>
      </div>
      <Dialog>
        <DialogTrigger className="cursor-pointer" asChild>
          <Button variant="secondary" size="sm">
            View Changes
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ChangesDetails({ data }: { data: Audit }) {
  const prevValues = data.changes.before || {};
  const newValues = data.changes.after || {};

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">Review Changes</p>
        {data.action === "update" && (
          <ComparedChanges prevValues={prevValues} newValues={newValues} />
        )}
        {data.action === "delete" && <ViewDeletedData />}
      </div>
    </>
  );
}
