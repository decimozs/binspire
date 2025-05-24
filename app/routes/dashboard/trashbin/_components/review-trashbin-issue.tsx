import { useEffect, useState } from "react";
import Loading from "@/components/shared/loading";
import { SheetContainer } from "@/components/shared/sheet-content";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TrashbinQuery } from "@/query/trashbins.query";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DynamicTrashbinIssueStatusBadge } from "@/components/shared/dynamic-badge";
import { fallbackInitials, formatDate } from "@/lib/utils";
import { MarkAsFixTrashbin } from "@/components/action/trashbins";

export default function ReviewTrashbinIssue() {
  const key = "review-trashbin-issue";

  const [issueIdParam, setIssueIdParam] = useQueryState("issue_id");
  const [viewTrashbinIssueParam, setViewTrashbinIssueParam] = useQueryState(
    "view_trashbin_issue",
  );

  const [open, setOpen] = useState(false);

  const { data: trashbinIssue, isPending } = useQuery({
    queryKey: [key, issueIdParam],
    queryFn: () => TrashbinQuery.getTrashbinIssueById(issueIdParam as string),
    enabled: !!issueIdParam,
  });

  useEffect(() => {
    if (issueIdParam && viewTrashbinIssueParam) {
      setOpen(true);
    }
  }, [issueIdParam, viewTrashbinIssueParam]);

  const handleSheetClose = () => {
    setOpen(false);
    setTimeout(() => {
      setIssueIdParam(null);
      setViewTrashbinIssueParam(null);
    }, 500);
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && handleSheetClose()}>
      <SheetContainer>
        {isPending || !trashbinIssue ? (
          <Loading message="Loading trashbin issue data..." />
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Review</SheetTitle>
              <SheetDescription>
                This section provides detailed information about the reported
                trashbin issue, including the trashbin’s identity, location,
                issue type, severity, and current resolution status. Carefully
                review the information before proceeding, as your actions may
                impact maintenance workflows and data accuracy within the
                system.
              </SheetDescription>
            </SheetHeader>
            <div className="mx-4 border-[1px] border-input rounded-sm p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                  <SheetTitle>Issue</SheetTitle>
                  <DynamicTrashbinIssueStatusBadge
                    status={trashbinIssue.data.status}
                  />
                </div>
                <div>
                  <p className="mb-2">{trashbinIssue.data.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Issue Id: {trashbinIssue.data.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Issued on: {formatDate(trashbinIssue.data.createdAt)}
                  </p>
                </div>
                <div className="border-[1px] border-input rounded-sm p-4">
                  <p className="text-sm text-muted-foreground">
                    {trashbinIssue.data.description}
                  </p>
                </div>
                <p>Issued by</p>
                <div className="flex flex-row gap-4">
                  <Avatar className="h-[50px] w-[50px]">
                    <AvatarImage
                      src={trashbinIssue.data.user.image as string}
                    />
                    <AvatarFallback>
                      {fallbackInitials(trashbinIssue.data.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p>{trashbinIssue.data.user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {trashbinIssue.data.user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter>
              <MarkAsFixTrashbin data={trashbinIssue.data} />
            </SheetFooter>
          </>
        )}
      </SheetContainer>
    </Sheet>
  );
}
