import type { Trashbin, TrashbinCollection, TrashbinIssue } from "@/lib/types";
import {
  useDeleteTrashbinFetcher,
  type TrashbinActionData,
} from "@/routes/resource/trashbins.resource";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  ArrowDown,
  CircleCheck,
  CircleX,
  Info,
  Loader2,
  Trash,
} from "lucide-react";
import {
  useUpdateTrashbinIssueFetcher,
  type TrashbinIssueActionData,
} from "@/routes/dashboard/trashbin/issues";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTrashbinCollectionFetcher } from "@/routes/dashboard/trashbin/collection";

type DialogEvent = "open" | "close";

export const MarkAsFixTrashbin = ({
  data,
}: {
  data: TrashbinIssue[number];
}) => {
  const issue = data;
  const trashbin = data.trashbin;
  const componentKey = "mark-as-fix-trashbin";
  const fetcher = useFetcher<TrashbinIssueActionData>({ key: componentKey });
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";
  const [fixTrashbinParam, setFixTrashbinParam] = useQueryState("fix_trashbin");
  const [open, setOpen] = useState(false);
  const actionFetcher = useUpdateTrashbinIssueFetcher(componentKey);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (fixTrashbinParam) {
      setOpen(true);
    }
  }, [fixTrashbinParam]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Trashbin marked as fixed", {
        action: {
          label: "Close",
          onClick: () => console.log("close"),
        },
      });
      setOpen(false);
      setTimeout(() => {
        setFixTrashbinParam(null);
      }, 500);
      queryClient.invalidateQueries({
        queryKey: ["review-trashbin-issue", issue.id],
      });
    }
  }, [actionData]);

  const handleDialogEvent = (event: "open" | "close") => {
    if (event === "open") {
      setFixTrashbinParam("true");
    } else {
      setOpen(false);
      setTimeout(() => {
        setFixTrashbinParam(null);
      }, 500);
    }
  };

  const handleFixTrashbin = () => {
    actionFetcher.submit(issue.id, {
      status: "fixed",
    });
  };

  const isIssueFixed = issue.status === "fixed" ? true : false;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && handleDialogEvent("close")}
    >
      <DialogTrigger
        onClick={() => handleDialogEvent("open")}
        disabled={isIssueFixed}
        asChild
      >
        {isIssueFixed ? (
          <Button variant="outline" className="h-12 p-4">
            <CircleX />
            Issue Closed
          </Button>
        ) : (
          <Button variant="outline" className="h-12 p-4">
            <CircleCheck />
            Mark as fix
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark this issue as fixed?</DialogTitle>
          <DialogDescription>
            You're confirming that this issue has been resolved. Once marked as
            fixed, it will be removed from the issue queue.
          </DialogDescription>
        </DialogHeader>
        <div className="border-input border-[1px] bg-muted p-4 text-sm rounded-md">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <Info />
            </div>
            <div>
              <p>Issue</p>
              <p className="text-muted-foreground">{issue.name}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full justify-center">
          <ArrowDown />
        </div>
        <div className="border-green-500 border-[1px] p-4 text-sm rounded-md bg-green-400/50">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <CircleCheck />
            </div>
            <div>
              <p>Issue Fixed</p>
              <p>{trashbin.name} Trashbin</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleFixTrashbin} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-auto animate-spin" />}
            {!isSubmitting ? "Confirm" : "Marking..."}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteTrashbin = ({ data }: { data: Trashbin }) => {
  const trashbin = data;
  const componentKey = "delete-trashbin";
  const fetcher = useFetcher<TrashbinActionData>({ key: componentKey });
  const actionData = fetcher.data;
  const actionFetcher = useDeleteTrashbinFetcher(componentKey, trashbin.id);
  const isSubmitting = fetcher.state === "submitting";
  const [, setTrashbinIdParam] = useQueryState("trashbin_id");
  const [deleteTrashbinParam, setDeleteTrashbinParam] =
    useQueryState("delete_trashbin");
  const handleDialogEvent = (event: DialogEvent) => {
    switch (event) {
      case "open": {
        setTrashbinIdParam(trashbin.id);
        setDeleteTrashbinParam("true");
        break;
      }
      case "close": {
        setTrashbinIdParam(null);
        setDeleteTrashbinParam(null);
        break;
      }
    }
  };

  const handleDeleteTrashbin = () => {
    actionFetcher.submit();
  };

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Successfully deleted trashbin", {
        action: {
          label: "Close",
          onClick: () => console.log("close"),
        },
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [actionData]);

  return (
    <Dialog
      open={!!deleteTrashbinParam}
      onOpenChange={(open) => {
        if (!open) {
          handleDialogEvent("close");
        }
      }}
    >
      <DialogTrigger onClick={() => handleDialogEvent("open")} asChild>
        <Button
          variant="ghost"
          className="p-2 font-normal w-full justify-start"
        >
          {" "}
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this trashbin?</DialogTitle>
          <DialogDescription>
            You're about to delete this trashbin. You can’t undo this action
            after confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="border-input border-[1px] bg-muted p-4 text-sm rounded-md">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <Trash />
            </div>
            <div>
              <p>Trashbin {trashbin.id}</p>
              <p className="text-muted-foreground">{trashbin.name}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeleteTrashbin} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-auto animate-spin" />}
            {!isSubmitting ? "Confirm" : "Collecting..."}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteTrashbinCollection = ({
  data,
}: {
  data: TrashbinCollection[number];
}) => {
  const collection = data;
  const componentKey = "delete-trashbin-collection";
  const fetcher = useFetcher<TrashbinActionData>({ key: componentKey });
  const actionData = fetcher.data;
  const actionFetcher = useDeleteTrashbinCollectionFetcher(componentKey);
  const isSubmitting = fetcher.state === "submitting";
  const [trashbinCollectionIdParam, seTrashbinCollectionIdParam] =
    useQueryState("collection_id");
  const [deleteTrashbinCollectionParam, setDeleteTrashbinCollectionParam] =
    useQueryState("delete_trashbin_collection");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (trashbinCollectionIdParam && deleteTrashbinCollectionParam) {
      setOpen(true);
    }
  }, [trashbinCollectionIdParam, deleteTrashbinCollectionParam]);

  const handleDialogEvent = (event: DialogEvent) => {
    switch (event) {
      case "open": {
        seTrashbinCollectionIdParam(collection.id);
        setDeleteTrashbinCollectionParam("true");
        break;
      }
      case "close": {
        setOpen(false);
        setTimeout(() => {
          seTrashbinCollectionIdParam(null);
          setDeleteTrashbinCollectionParam(null);
        }, 500);
        break;
      }
    }
  };

  const handleDeleteTrashbinCollection = () => {
    actionFetcher.submit(collection.id);
  };

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Successfully deleted trashbin collection", {
        action: {
          label: "Close",
          onClick: () => console.log("close"),
        },
      });
      setOpen(false);
      setTimeout(() => {
        seTrashbinCollectionIdParam(null);
        setDeleteTrashbinCollectionParam(null);
      }, 500);
    }
  }, [actionData]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && handleDialogEvent("close")}
    >
      <DialogTrigger onClick={() => handleDialogEvent("open")} asChild>
        <Button
          variant="ghost"
          className="p-2 font-normal w-full justify-start"
        >
          {" "}
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this trashbin collection?</DialogTitle>
          <DialogDescription>
            You're about to delete this trashbin collection. You can’t undo this
            action after confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="border-input border-[1px] bg-muted p-4 text-sm rounded-md">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <Trash />
            </div>
            <div>
              <p>Trashbin {collection.id}</p>
              <p className="text-muted-foreground">{collection.id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full justify-center">
          <ArrowDown />
        </div>
        <div className="border-red-500 border-[1px] p-4 text-sm rounded-md bg-red-400/50">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <CircleX />
            </div>
            <div>
              <p>Trashbin Collection</p>
              <p>{collection.trashbin.name} Trashbin</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDeleteTrashbinCollection}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-auto animate-spin" />}
            {!isSubmitting ? "Confirm" : "Collecting..."}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
