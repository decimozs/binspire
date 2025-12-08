import type { TrashbinLog } from "@binspire/db/types";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { format } from "date-fns";
import { ArrowUpRight, Eye, Shredder } from "lucide-react";
import { useMemo, useState } from "react";

export default function CollectionLogs({
  logsRaw,
}: {
  logsRaw: TrashbinLog[];
}) {
  const logs = useMemo(
    () =>
      [...logsRaw].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [logsRaw],
  );

  const [logsOpen, setLogsOpen] = useState(false);

  const WASTE_CLASSES = [
    "Plastics",
    "Paper",
    "Electronic Device",
    "Glass",
    "Metal",
    "Organic",
  ];

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    WASTE_CLASSES.forEach((c) => (counts[c] = 0));

    logs.forEach((log) => {
      if (counts[log.class] !== undefined) {
        counts[log.class] += 1;
      }
    });

    return counts;
  }, [logs]);

  return (
    <Sheet open={logsOpen} onOpenChange={setLogsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          Logs
          <ArrowUpRight className="ml-1 mt-0.5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Trash Logs</SheetTitle>
          <SheetDescription>
            View the types of waste collected in the bin, such as plastics,
            paper, electronic devices, and more.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 -mt-4 grid grid-cols-2 gap-2">
          {WASTE_CLASSES.filter(
            (category) => countsByCategory[category] > 0,
          ).map((category) => (
            <div
              key={category}
              className="py-2 px-4 border-[1px] bg-card border-muted rounded-md flex flex-row items-center justify-between"
            >
              <span className="text-sm">{category}</span>
              <span className="font-bold text-primary">
                {countsByCategory[category]}
              </span>
            </div>
          ))}
        </div>

        <ScrollArea className="h-[72vh] px-4">
          <div className="space-y-2">
            {logs.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Shredder />
                  </EmptyMedia>
                  <EmptyTitle>No logs yet.</EmptyTitle>
                  <EmptyDescription>
                    There are no waste detection logs available for this
                    trashbin.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            {logs.map((log) => (
              <div
                key={`${log.timestamp}-${log.class}`}
                className="py-2 px-4 border rounded-md border-dashed flex justify-between items-center"
              >
                <div className="w-full">
                  <div className="flex flex-row items-center justify-between relative w-full">
                    <p className="font-medium mb-2">{log.class}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute -right-1 top-0"
                        >
                          <Eye />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[1200px]">
                        <DialogHeader>
                          <DialogTitle>Object Detected</DialogTitle>
                          <DialogDescription>
                            Image detected as <b>{log.class}</b> with{" "}
                            <b>{(log.confidence * 100).toFixed(0)}%</b>{" "}
                            confidence.
                          </DialogDescription>
                        </DialogHeader>
                        <img
                          src={log.imageUrl}
                          alt="object-detected"
                          className="w-full max-h-[70vh] object-contain"
                        />
                        <DialogFooter>
                          <a
                            href={log.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button size="sm">External View</Button>
                          </a>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="orange-badge w-fit mb-2">
                    Confidence: {(log.confidence * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    Timestamp:{" "}
                    {format(
                      new Date(log.timestamp),
                      "MMMM d, yyyy - hh:mm:ss a",
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
