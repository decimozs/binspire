import {
  useRealtimeUpdatesStore,
  useTrashbinRealtime,
} from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Button } from "@binspire/ui/components/button";
import { ExternalLink, Telescope } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";

export default function Telemetry() {
  const updates = useRealtimeUpdatesStore((state) => state.updates);
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 relative">
          <Telescope />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="min-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <div className="flex flex-row items-center gap-2">
            <SheetTitle>Live Updates</SheetTitle>
            <ExternalLink
              size={15}
              className="text-muted-foreground cursor-pointer"
              onClick={() => {
                const height = window.screen.height;
                window.open(
                  "/live-updates",
                  "_blank",
                  `width=500,height=${height},top=0,left=0,resizable,scrollbars`,
                );
              }}
            />
          </div>
          <SheetDescription>
            View real-time updates on trashbin statuses and activities.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 -mt-4">
          {!hasValidConnection && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Telescope />
                </EmptyMedia>
                <EmptyTitle>No Live Updates Available</EmptyTitle>
                <EmptyDescription>
                  Live updates will appear here once the telemetry system is
                  connected and trashbins are active.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {hasValidConnection && (
            <ScrollArea className="h-[90vh] pr-4">
              <div className="space-y-2">
                {updates.map((update, index) => (
                  <div
                    key={index}
                    className="animate-fadeIn transition-all duration-700 bg-card p-4 rounded-md flex flex-col gap-1"
                  >
                    <p>{update.msg}</p>
                    <p className="text-muted-foreground text-right text-sm">
                      {formatDistanceToNow(new Date(update.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
