import { useTrashbinRealtime } from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import { useEffect, useState } from "react";

const SAMPLE_UPDATES = [
  "Trashbin A level increased to 75%",
  "Trashbin C emptied successfully",
  "Trashbin B lid opened",
  "New trashbin connected: Bin D",
  "Trashbin A nearing capacity",
  "Sensor data recalibrated",
  "Bin D level dropped to 12%",
  "Connection restored to Bin C",
];

export default function LiveUpdates() {
  const [updates, setUpdates] = useState<string[]>([]);
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const random =
        SAMPLE_UPDATES[Math.floor(Math.random() * SAMPLE_UPDATES.length)];
      setUpdates((prev) => {
        const next = [random, ...prev].slice(0, 6);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!hasValidConnection) return null;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-sm font-semibold">Live Updates</h1>
      <div className="relative flex flex-col gap-2 text-xs overflow-hidden h-28">
        {updates.map((update, index) => (
          <div
            key={index}
            className="animate-fadeIn opacity-100 transition-all duration-700"
            style={{
              opacity: 1 - index * 0.15,
            }}
          >
            Trashbin 1: {update}
          </div>
        ))}

        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white opacity-0 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
