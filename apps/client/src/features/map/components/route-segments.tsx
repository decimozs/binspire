import { Button } from "@binspire/ui/components/button";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { useRouteStore } from "@/store/route-store";

export default function RouteSegments({ steps }: { steps: any }) {
  const { route } = useRouteStore();
  const feature = route?.features?.[0];
  const distance = feature?.properties?.summary?.distance ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="font-bold text-xl">
          Route Segments
        </Button>
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
                  <div>
                    {index === 0 && (
                      <p className="orange-badge w-fit mb-2">Start</p>
                    )}
                    {index === steps.length - 1 && (
                      <p className="green-badge w-fit mb-2">End</p>
                    )}
                    <p className="font-bold text-xl">{step.instruction}</p>
                  </div>
                  <p className="text-muted-foreground">
                    {step.distance.toFixed(0)} m • {Math.round(step.duration)} s
                  </p>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">No steps available.</p>
          )}
        </div>
        <SheetFooter>
          <div className="flex flex-row items-center justify-between font-bold text-xl">
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
