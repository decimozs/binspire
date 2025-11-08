import { useGetAllIssues } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { Hammer, Info } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import ViewTrashbinIssue from "./view-trashbin-issue";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";

export default function TrashbinIssues() {
  const [open, setOpen] = useQueryState(
    "trashbin_issues",
    parseAsBoolean.withDefault(false),
  );
  const { data, isPending } = useGetAllIssues();

  const trashbinIssues = data?.filter(
    (i) =>
      i.entity === "trashbinManagement" &&
      i.status !== "resolved" &&
      i.status !== "closed",
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      <DrawerTrigger asChild>
        {isPending ? (
          <Skeleton className="h-10 w-12" />
        ) : (
          <Button variant="secondary" size="lg" className="relative h-12">
            <Hammer />
            <span className="absolute -end-1 -top-1 size-5 rounded-full bg-red-500 flex items-center justify-center">
              <p className="text-xs">{trashbinIssues?.length}</p>
            </span>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[50%]">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">Issues</DrawerTitle>
          <DrawerDescription>
            List of trashbins that has issues needing attention
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 overflow-hidden pb-4">
          {isPending ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-[92px]" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {trashbinIssues &&
                trashbinIssues.length > 0 &&
                trashbinIssues.map((issue) => (
                  <ViewTrashbinIssue key={issue.id} issue={issue} />
                ))}
            </div>
          )}
        </ScrollArea>
        {trashbinIssues && trashbinIssues.length === 0 && (
          <Empty className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Info />
              </EmptyMedia>
              <EmptyTitle>No Trashbin Issues Found</EmptyTitle>
              <EmptyDescription>
                Great job! There are currently no reported issues with any
                trashbins. Check back later or report a new issue if something
                comes up.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </DrawerContent>
    </Drawer>
  );
}
