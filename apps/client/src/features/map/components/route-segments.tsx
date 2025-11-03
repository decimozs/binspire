import { Button } from "@binspire/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { useRouteStore } from "@/store/route-store";

export default function RouteSegments({ steps }: { steps: any }) {
  const { route } = useRouteStore();
  const feature = route?.features?.[0];
  const distance = feature?.properties?.summary?.distance ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Route Segments</Button>
      </SheetTrigger>

      <SheetContent className="w-full flex flex-col">
        <SheetHeader className="shrink-0">
          <SheetTitle className="text-2xl">Route Segments</SheetTitle>
          <SheetDescription>
            Detailed route segments will be displayed here.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-4 overflow-hidden">
          {steps.length > 0 ? (
            <ScrollArea className="h-full pr-4">
              {steps.map((step: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col border-b border-muted pb-3 mb-3"
                >
                  <span className="font-bold text-xl">{step.instruction}</span>
                  <span className="text-muted-foreground">
                    {step.distance.toFixed(0)} m • {Math.round(step.duration)} s
                  </span>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">No steps available.</p>
          )}
        </div>
        <SheetFooter>
          <div className="flex flex-row items-center justify-between font-bold">
            <p>Total Distance</p>
            <p className="text-muted-foreground">
              {(distance / 1000).toFixed(2) + " km"}
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
