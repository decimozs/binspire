import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";
import { useMemo } from "react";
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
import { ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@binspire/ui/components/scroll-area";

export default function TrashbinLogs({ id }: { id: string }) {
  const logsRaw = useTrashbinLogsStore((state) => state.logs);
  const logs = useMemo(() => logsRaw[id] || [], [logsRaw, id]);

  if (!id) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="grow">
          Logs
          <ArrowUpRight className="ml-1 mt-0.5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Trash Logs</SheetTitle>
          <SheetDescription>
            View the types of waste collected in the bin, such as plastics,
            paper, electronic devices, and more.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[85vh] px-4">
          <div className="space-y-2">
            {logs.length === 0 && <p className="text-gray-500">No logs yet.</p>}
            {logs.map((log, index) => (
              <div
                key={index}
                className="p-2 border rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{log.class}</p>
                  <p className="text-sm text-gray-500">
                    Confidence: {(log.confidence * 100).toFixed(1)}%
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
