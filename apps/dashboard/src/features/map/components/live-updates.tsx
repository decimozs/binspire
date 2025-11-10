import {
  useRealtimeUpdatesStore,
  useTrashbinRealtime,
} from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import { ScrollArea } from "@binspire/ui/components/scroll-area";

export default function LiveUpdates() {
  const updates = useRealtimeUpdatesStore((state) => state.updates);
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  if (!hasValidConnection) return null;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-sm font-semibold red-badge w-fit">Live Updates</h1>
      <ScrollArea className="relative text-xs overflow-y-auto h-[400px] pr-4">
        <div className="space-y-2">
          {updates.length === 0 && (
            <p className="text-muted-foreground">No recent updates.</p>
          )}
          {updates.map((update, index) => (
            <div
              key={index}
              className="animate-fadeIn transition-all duration-700"
            >
              {update}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
