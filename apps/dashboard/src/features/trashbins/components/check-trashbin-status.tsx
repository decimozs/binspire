import { Button } from "@binspire/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { ArrowUpRight } from "lucide-react";
import { TrashbinRadialStatus } from "./trashbin-radial-status";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { TrashbinStatus } from "@/features/trashbin-collections/components/trashbin-details";
import { useState } from "react";

interface Props {
  id: string;
}

export default function CheckTrashbinStatus({ id }: Props) {
  const bins = useTrashbinRealtime((state) => state.bins);
  const bin = bins[id];
  const [statusOpen, setStatusOpen] = useState(false);

  if (!bin) {
    return (
      <Button variant="outline" size="lg" className="grow" disabled>
        Waiting for Data...
      </Button>
    );
  }

  const { wasteLevel, weightLevel, batteryLevel } = bin;

  const MAX_DISTANCE = 53;
  const fillLevel = Math.max(
    0,
    Math.min(100, ((MAX_DISTANCE - wasteLevel) / MAX_DISTANCE) * 100),
  );

  return (
    <Sheet open={statusOpen} onOpenChange={setStatusOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="grow">
          Status
          <ArrowUpRight className="ml-1 mt-0.5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Trashbin Status</SheetTitle>
          <SheetDescription>Check current real-time status</SheetDescription>
        </SheetHeader>
        <ScrollArea className="px-4 overflow-auto rounded-md pb-4 -mt-4">
          <div className="grid grid-cols-1 gap-4">
            <TrashbinRadialStatus
              title="Waste Level"
              description="Current Waste Level"
              data={[
                { role: "Filled", count: fillLevel },
                { role: "Remaining", count: 100 - fillLevel },
              ]}
              config={{
                Filled: { label: "Filled", color: "var(--chart-1)" },
                Remaining: { label: "Remaining", color: "var(--chart-4)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${fillLevel}%`}
              badge={
                <TrashbinStatus
                  label="Waste Level"
                  value={Number(fillLevel.toFixed(0))}
                  unit="%"
                  type="waste-level"
                  enabledColumn={true}
                />
              }
            />

            <TrashbinRadialStatus
              title="Weight Level"
              description="Current Weight (kg)"
              data={[
                { role: "Weight", count: weightLevel },
                { role: "Remaining", count: Math.max(0, 30 - weightLevel) },
              ]}
              config={{
                Weight: { label: "Weight", color: "var(--chart-1)" },
                Remaining: { label: "Remaining", color: "var(--chart-4)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${weightLevel.toFixed(2)} kg`}
              badge={
                <TrashbinStatus
                  label="Weight Level"
                  value={weightLevel}
                  unit="kg"
                  type="weight-level"
                  enabledColumn={true}
                />
              }
            />

            <TrashbinRadialStatus
              title="Battery Level"
              description="Battery Percentage"
              data={[
                { role: "Battery", count: batteryLevel },
                { role: "Used", count: 100 - batteryLevel },
              ]}
              config={{
                Battery: { label: "Battery", color: "var(--chart-1)" },
                Used: { label: "Used", color: "var(--chart-4)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${batteryLevel}% battery remaining`}
              badge={
                <TrashbinStatus
                  label="Battery Level"
                  value={batteryLevel}
                  unit="%"
                  type="battery-level"
                  enabledColumn={true}
                />
              }
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
