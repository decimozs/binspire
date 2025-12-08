import { useGetMaintenanceById, useQueryClient } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { differenceInSeconds, format } from "date-fns";
import { Construction, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function MaintenanceScreen() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { data: maintenance, isPending } = useGetMaintenanceById(
    session?.user.orgId!,
  );

  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!maintenance?.endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(maintenance.endTime as string | number);

      const totalSeconds = differenceInSeconds(end, now);

      if (totalSeconds <= 0) {
        setRemainingTime("0m");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setRemainingTime(
        `${hours > 0 ? hours + "h " : ""}${minutes}m ${
          seconds > 0 ? seconds + "s" : ""
        }`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [maintenance?.endTime]);

  useEffect(() => {
    if (!maintenance) return;

    if (!maintenance.isInMaintenance) {
      window.location.href = "/";
    }
  }, [maintenance]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await queryClient.invalidateQueries({
        queryKey: ["maintenance", session?.user.orgId],
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
      if (maintenance?.isInMaintenance) window.location.href = "/";
    }
  };

  if (isPending || !maintenance) {
    return (
      <div className="from-muted/50 to-background h-full bg-gradient-to-b from-30% w-full h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30% w-full h-screen flex items-center justify-center">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Construction />
        </EmptyMedia>
        <EmptyTitle>Scheduled Maintenance</EmptyTitle>
        <EmptyDescription>
          Our system is currently undergoing maintenance to improve performance
          and reliability. We appreciate your patience and will be back shortly.
        </EmptyDescription>
      </EmptyHeader>

      <div className="w-[500px]">
        <div className="grid grid-cols-[100px_1fr] mb-4">
          <p className="font-bold">Title</p>
          <p className="text-muted-foreground text-left">{maintenance.title}</p>
        </div>
        <div className="grid grid-cols-[100px_1fr]">
          <p className="font-bold">Cause</p>
          <p className="text-muted-foreground text-left">
            {maintenance.description}
          </p>
        </div>
      </div>

      <EmptyContent>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-[1.1rem]">Maintenance Window</p>
          {maintenance.startTime && maintenance.endTime ? (
            <>
              <div className="grid grid-cols-[1fr_10px_1fr] gap-4">
                <p className="text-muted-foreground">
                  {format(
                    new Date(maintenance.startTime),
                    "MMM d, yyyy, h:mm a",
                  )}
                </p>
                <p>-</p>
                <p className="text-muted-foreground">
                  {format(new Date(maintenance.endTime), "MMM d, yyyy, h:mm a")}
                </p>
              </div>

              {!remainingTime ? (
                <div className="flex items-center justify-center flex-col w-full mt-4">
                  <Skeleton className="w-full h-[50px]" />
                </div>
              ) : (
                <div className="flex items-center justify-center flex-col w-full mt-4">
                  <p>Estimated Time</p>
                  <p className="text-[3rem]">{remainingTime}</p>
                </div>
              )}
            </>
          ) : (
            <p>Maintenance schedule not available</p>
          )}
        </div>

        <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
