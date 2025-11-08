import { useMemo, useState } from "react";
import { Button } from "@binspire/ui/components/button";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Trash } from "lucide-react";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";

export default function TrashbinLogs({ id }: { id: string }) {
  const logsRaw = useTrashbinLogsStore((state) => state.logs);
  const logs = useMemo(() => {
    const rawLogs = logsRaw[id] || [];
    return [...rawLogs].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [logsRaw, id]);
  const [logsOpen, setLogsOpen] = useState(false);

  const WASTE_CLASSES = [
    "Plastics",
    "Paper",
    "Electronic Device",
    "Glass",
    "Metal",
    "Organic",
  ];

  if (!id) return null;

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
        <Button variant="secondary" className="font-bold">
          <Trash />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full"
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
              <span className="text-sm font-bold">{category}</span>
              <span className="font-bold text-primary">
                {countsByCategory[category]}
              </span>
            </div>
          ))}
        </div>

        <ScrollArea className="h-[60vh] px-4 pb-4">
          <div className="space-y-2">
            {logs.length === 0 && <p className="text-gray-500">No logs yet.</p>}
            {logs.map((log, index) => (
              <div
                key={index}
                className="py-2 font-bold px-4 border rounded-md border-dashed flex justify-between items-center"
              >
                <div>
                  <p className="text-xl mb-2">{log.class}</p>
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
