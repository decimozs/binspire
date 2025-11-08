import WarningSign from "@/components/sign/warnings";
import { useFilterTrashbin } from "@/hooks/use-filter-trashbin";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import { useGetAllTrashbins } from "@binspire/query";
import { formatLabel, TRASHBIN_CONFIG } from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { Separator } from "@binspire/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { Blend } from "lucide-react";

export default function FilterTrashbin() {
  const { data, isPending } = useGetAllTrashbins();
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);
  const {
    departmentQuery,
    setDepartmentQuery,
    wasteLevelQuery,
    setWasteLevelQuery,
    weightLevelQuery,
    setWeightLevelQuery,
    batteryLevelQuery,
    setBatteryLevelQuery,
    collectedQuery,
    setCollectedQuery,
    scheduledQuery,
    setScheduledQuery,
    operationalQuery,
    setOperationalQuery,
    archivedQuery,
    setArchivedQuery,
  } = useFilterTrashbin();

  const isDefaultFilters =
    departmentQuery === "general" &&
    wasteLevelQuery === "all" &&
    weightLevelQuery === "all" &&
    batteryLevelQuery === "all" &&
    collectedQuery === "all" &&
    scheduledQuery === "all" &&
    operationalQuery === "all" &&
    archivedQuery === "all";

  if (isPending || !data) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const departments = Array.from(
    new Set(data.map((trashbin) => trashbin.department)),
  );

  const allDepartments = departments.includes("general")
    ? departments
    : ["general", ...departments];

  const wasteLevelOptions = Object.entries(TRASHBIN_CONFIG["waste-level"]).map(
    ([key, config]) => ({
      value: key,
      label: config.label,
    }),
  );

  const weightLevelOptions = Object.entries(
    TRASHBIN_CONFIG["weight-level"],
  ).map(([key, config]) => ({
    value: key,
    label: config.label,
  }));

  const batteryLevelOptions = Object.entries(
    TRASHBIN_CONFIG["battery-level"],
  ).map(([key, config]) => ({
    value: key,
    label: config.label,
  }));

  const allWasteLevelOptions = [
    { value: "all", label: "All Levels" },
    ...wasteLevelOptions,
  ];

  const allWeightLevelOptions = [
    { value: "all", label: "All Levels" },
    ...weightLevelOptions,
  ];

  const allBatteryLevelOptions = [
    { value: "all", label: "All Levels" },
    ...batteryLevelOptions,
  ];

  const handleReset = () => {
    setDepartmentQuery("general");
    setWasteLevelQuery("all");
    setWeightLevelQuery("all");
    setBatteryLevelQuery("all");
    setCollectedQuery("all");
    setScheduledQuery("all");
    setOperationalQuery("all");
    setArchivedQuery("all");
  };

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Blend />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Filter Trashbins</SheetTitle>
          <SheetDescription>
            Filter trashbins by various criteria.
          </SheetDescription>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Department</p>
              <Select
                value={departmentQuery}
                onValueChange={setDepartmentQuery}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {allDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {formatLabel(dept)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {!hasValidConnection && (
              <WarningSign
                message="Telemetry is not connected. Waste, Weight, and Battery level filters are disabled."
                iconSize={18}
                className="text-xs"
                iconClassName="mt-0.5"
              />
            )}

            <div className="flex flex-col gap-2">
              <p className="text-sm">Waste Level</p>
              <Select
                value={wasteLevelQuery}
                onValueChange={setWasteLevelQuery}
              >
                <SelectTrigger
                  className="w-full"
                  disabled={!hasValidConnection}
                >
                  <SelectValue placeholder="Select waste level" />
                </SelectTrigger>
                <SelectContent>
                  {allWasteLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm">Weight Level</p>
              <Select
                value={weightLevelQuery}
                onValueChange={setWeightLevelQuery}
              >
                <SelectTrigger
                  className="w-full"
                  disabled={!hasValidConnection}
                >
                  <SelectValue placeholder="Select waste level" />
                </SelectTrigger>
                <SelectContent>
                  {allWeightLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm">Battery Level</p>
              <Select
                value={batteryLevelQuery}
                onValueChange={setBatteryLevelQuery}
              >
                <SelectTrigger
                  className="w-full"
                  disabled={!hasValidConnection}
                >
                  <SelectValue placeholder="Select waste level" />
                </SelectTrigger>
                <SelectContent>
                  {allBatteryLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm">Operational</p>
                <Select
                  value={operationalQuery}
                  onValueChange={setOperationalQuery}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Operational</SelectItem>
                    <SelectItem value="false">Not Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4">
                {/* Collected Filter */}
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm">Collected</p>
                  <Select
                    value={collectedQuery}
                    onValueChange={setCollectedQuery}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Collected</SelectItem>
                      <SelectItem value="false">Uncollected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm">Scheduled</p>
                  <Select
                    value={scheduledQuery}
                    onValueChange={setScheduledQuery}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Scheduled</SelectItem>
                      <SelectItem value="false">Unscheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm">Archived</p>
                  <Select
                    value={archivedQuery}
                    onValueChange={setArchivedQuery}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Archived</SelectItem>
                      <SelectItem value="false">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>
        <SheetFooter>
          <Button
            type="button"
            size="lg"
            variant="destructive"
            onClick={handleReset}
            disabled={isDefaultFilters}
          >
            Reset All Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
