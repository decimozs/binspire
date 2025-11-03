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

interface Props {
  id: string;
}

export default function CheckTrashbinStatus({ id }: Props) {
  const bins = useTrashbinRealtime((state) => state.bins);
  const bin = bins[id];

  if (!bin) {
    return (
      <Button variant="outline" size="lg" className="grow" disabled>
        Waiting for Data...
      </Button>
    );
  }

  const { wasteLevel, weightLevel, batteryLevel } = bin;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="w-[50%]">
          Check Status
          <ArrowUpRight className="ml-1 mt-0.5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Trashbin Status</SheetTitle>
          <SheetDescription>Check current real-time status</SheetDescription>
        </SheetHeader>
        <ScrollArea className="px-4 overflow-auto rounded-md pb-4">
          <div className="grid grid-cols-1 gap-4">
            <TrashbinRadialStatus
              title="Waste Level"
              description="Current Waste Level"
              data={[
                { role: "Filled", count: wasteLevel },
                { role: "Remaining", count: 100 - wasteLevel },
              ]}
              config={{
                Filled: { label: "Filled", color: "var(--chart-1)" },
                Remaining: { label: "Remaining", color: "var(--chart-2)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`${wasteLevel}%`}
              badge={
                <TrashbinStatus
                  label="Waste Level"
                  value={wasteLevel}
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
                Remaining: { label: "Remaining", color: "var(--chart-2)" },
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
                Used: { label: "Used", color: "var(--chart-2)" },
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
