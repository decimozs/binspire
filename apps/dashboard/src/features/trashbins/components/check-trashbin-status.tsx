import { Button } from "@binspire/ui/components/button";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { TrashbinStatus } from "@/features/trashbin-collections/components/trashbin-details";
import { getColor } from "@/lib/utils";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { TrashbinRadialStatus } from "./trashbin-radial-status";

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

  const wasteLevel = bin.wasteLevel ?? 0;
  const weightLevel = bin.weightLevel ?? 0;
  const batteryLevel = bin.batteryLevel ?? 0;
  const solarPowerLevel = bin.solarPower ?? 0;

  const MAX_DISTANCE = 16;
  const fillLevel = Math.max(
    0,
    Math.min(100, ((MAX_DISTANCE - wasteLevel) / MAX_DISTANCE) * 100),
  );

  const clampedSolarPower = Math.min(100, Math.max(0, solarPowerLevel));

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
                Filled: {
                  label: "Filled",
                  color: getColor("waste-level", fillLevel),
                },
                Remaining: {
                  label: "Remaining",
                  color: getColor("waste-level", 0),
                },
              }}
              level={String(fillLevel.toFixed(0))}
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
              level={String(weightLevel.toFixed(0))}
              data={[
                { role: "Weight", count: weightLevel },
                { role: "Remaining", count: Math.max(0, 30 - weightLevel) },
              ]}
              config={{
                Weight: {
                  label: "Weight",
                  color: getColor("weight-level", weightLevel),
                },
                Remaining: {
                  label: "Remaining",
                  color: getColor("weight-level", 0),
                },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${weightLevel.toFixed(0)} kg`}
              badge={
                <TrashbinStatus
                  label="Weight Level"
                  value={Number(weightLevel.toFixed(0))}
                  unit="kg"
                  type="weight-level"
                  enabledColumn={true}
                />
              }
            />

            <TrashbinRadialStatus
              title="Battery Level"
              description="Battery Percentage"
              level={String(batteryLevel.toFixed(0))}
              data={[
                { role: "Battery", count: batteryLevel },
                { role: "Used", count: 100 - batteryLevel },
              ]}
              config={{
                Battery: {
                  label: "Battery",
                  color: getColor("battery-level", batteryLevel),
                },
                Used: { label: "Used", color: getColor("battery-level", 0) },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${batteryLevel}% battery remaining`}
              badge={
                <TrashbinStatus
                  label="Battery Level"
                  value={Number(batteryLevel.toFixed(0))}
                  unit="%"
                  type="battery-level"
                  enabledColumn={true}
                />
              }
            />

            <TrashbinRadialStatus
              title="Solar Power"
              level={String(clampedSolarPower.toFixed(0))}
              description="Solar Power Percentage"
              data={[
                { role: "Power", count: clampedSolarPower },
                { role: "Used", count: 100 - clampedSolarPower },
              ]}
              config={{
                Power: {
                  label: "Power",
                  color: getColor("solar-power", clampedSolarPower),
                },
                Used: { label: "Used", color: getColor("solar-power", 0) },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${clampedSolarPower}% power remaining`}
              badge={
                <TrashbinStatus
                  label="Solar Power Level"
                  value={clampedSolarPower}
                  unit="%"
                  type="solar-power"
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
