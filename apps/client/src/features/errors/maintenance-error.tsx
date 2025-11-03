import { Button } from "@binspire/ui/components/button";
import { clsx } from "@binspire/ui/lib/utils";
import { useLocation } from "@tanstack/react-router";

export function MaintenanceError() {
  const location = useLocation();

  const containerHeight = location.pathname.includes("/dashboard")
    ? "h-[90vh]"
    : "h-svh";

  return (
    <div className={clsx(containerHeight)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">503</h1>
        <span className="font-medium">Website is under maintenance!</span>
        <p className="text-muted-foreground text-center">
          The site is not available at the moment. <br />
          We'll be back online shortly.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline">Learn more</Button>
        </div>
      </div>
    </div>
  );
}
