import { useQueryState } from "nuqs";
import { bezierSpline } from "@turf/turf";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useEffect, useRef, useState } from "react";
import type { GeoJSONData, Role, Trashbin, TrashbinStatus } from "@/lib/types";
import {
  useFetcher,
  useLocation,
  useNavigate,
  useRevalidator,
} from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  CircleArrowUp,
  Loader2,
  MapPin,
  Trash,
  Settings,
  CircleAlert,
  Navigation,
  Car,
} from "lucide-react";
import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import { SheetContainer } from "../shared/sheet-content";
import Loading from "../shared/loading";
import { DynamicTrashbinOperationalBadge } from "../shared/dynamic-badge";
import { formatRelativeTime } from "@/lib/utils";
import { TrashbinLevels } from "../charts/trashbin-levels";
import { Textarea } from "../ui/textarea";
import {
  type TrashbinActionData,
  useCreateTrashbinIssueFetcher,
  useUpdateTrashbinFetcher,
} from "@/routes/resource/trashbins.resource";
import { Input } from "../ui/input";
import { useNavigateStore } from "@/store/navigate.store";
import mqtt from "mqtt";

export const ReviewTrashbin = () => {
  const [trashbinIdParam] = useQueryState("trashbin_id");
  const [viewTrashbinParam] = useQueryState("view_trashbin");
  const [routeDirectionParam] = useQueryState("route_direction");
  const loaderData = useDashboardLayoutLoader();
  const fetcher = useFetcher();
  const [isLoading, setIsLoading] = useState(true);
  const trashbin = fetcher.data?.data as Trashbin | undefined;
  const userRole = loaderData?.user?.role as Role;
  const [liveTrashbins, setLiveTrashbins] = useState<Trashbin>();
  const revalidator = useRevalidator();

  useEffect(() => {
    const interval = setInterval(() => {
      revalidator.revalidate();
    }, 5000); //

    return () => clearInterval(interval);
  }, [revalidator]);

  useEffect(() => {
    const mqttClient = mqtt.connect("ws://test.mosquitto.org:8080");
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("arcovia/trashbin/status");
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "arcovia/trashbin/status") {
        const payload = JSON.parse(message.toString());
        const distance = payload.distance_cm;

        let wasteStatus: TrashbinStatus = "empty";
        if (distance < 20) wasteStatus = "overflowing";
        else if (distance < 50) wasteStatus = "full";
        else if (distance < 80) wasteStatus = "almost-full";
        console.log(payload);

        const newTrashbin: Trashbin = {
          id: payload.id,
          name: payload.name,
          isActive: payload.isActive,
          isCollected: payload.isCollected,
          wasteStatus: payload.wasteStatus,
          weightStatus: payload.weightStatus,
          batteryStatus: payload.batteryStatus,
          latitude: payload.latitude,
          longitude: payload.longitude,
          wasteLevel: payload.wasteLevel,
          weightLevel: payload.weightLevel,
          batteryLevel: payload.batteryLevel,
          createdAt: new Date(payload.createdAt),
          updatedAt: new Date(payload.updatedAt),
        };

        setLiveTrashbins(newTrashbin);
      }
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  useEffect(() => {
    if (trashbinIdParam) {
      setIsLoading(true);
      fetcher.load(`/resources/trashbins/${trashbinIdParam}`);
    }
  }, [trashbinIdParam]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }

    console.log(trashbin);
  }, [fetcher.state, fetcher.data]);

  if (trashbinIdParam === "f0nNI_aFd29dEM4H-bpqS") {
    return (
      <Sheet
        open={!!trashbinIdParam && !!viewTrashbinParam}
        onOpenChange={(open) => {
          if (!open)
            window.history.replaceState({}, "", window.location.pathname);
        }}
      >
        <SheetContainer>
          {isLoading || !trashbin ? (
            <Loading message="Loading trashbin data..." />
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Trashbin</SheetTitle>
                <SheetDescription>
                  This section displays the selected trashbin’s details,
                  including its name, location, waste and weight levels, and
                  current status. Carefully review the information before taking
                  any action, as your decision may impact collection schedules
                  and system data integrity.
                </SheetDescription>
              </SheetHeader>
              <div className="mx-4 border-[1px] border-input rounded-sm p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center justify-between">
                    <SheetTitle>Review</SheetTitle>
                    <DynamicTrashbinOperationalBadge
                      isActive={liveTrashbins?.isActive as boolean}
                    />
                  </div>
                  <p>Id {trashbin?.id}</p>
                  <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-sm text-muted-foreground">
                        Location
                      </h1>
                      <p className="text-sm flex flex-row gap-2 items-center wrap-anywhere">
                        <MapPin size={15} className="mt-[0.2rem]" />
                        {trashbin?.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="text-sm text-muted-foreground">
                        Last collected
                      </h1>
                      <p className="text-sm flex flex-row gap-2 items-center">
                        <CircleArrowUp size={15} className="mt-[0.1rem]" />
                        {formatRelativeTime(trashbin?.updatedAt as Date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-4 border-[1px] border-input rounded-sm p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center">
                    <SheetTitle>Levels</SheetTitle>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <TrashbinLevels
                      chartName="Waste Level"
                      level={Number(liveTrashbins?.wasteLevel)}
                      status={liveTrashbins?.wasteStatus as TrashbinStatus}
                    />
                    <TrashbinLevels
                      chartName="Weight Level"
                      level={Number(liveTrashbins?.weightLevel)}
                      status={liveTrashbins?.weightStatus as TrashbinStatus}
                    />
                    <TrashbinLevels
                      chartName="Battery Level"
                      level={Number(liveTrashbins?.batteryLevel)}
                      status={liveTrashbins?.batteryStatus as TrashbinStatus}
                    />
                  </div>
                </div>
              </div>
              <SheetFooter>
                <div className="flex flex-row gap-2 w-full items-center">
                  <NavigateTrashbin data={trashbin} />
                  {!trashbin.isCollected && userRole === "collector" && (
                    <CollectTrashbin data={trashbin} />
                  )}
                  {userRole === "collector" && (
                    <ReportTrashbin data={trashbin} />
                  )}
                  {userRole === "admin" && <TrashinSettings data={trashbin} />}
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContainer>
      </Sheet>
    );
  }

  return (
    <Sheet
      open={!!trashbinIdParam && !!viewTrashbinParam}
      onOpenChange={(open) => {
        if (!open)
          window.history.replaceState({}, "", window.location.pathname);
      }}
    >
      <SheetContainer>
        {isLoading || !trashbin ? (
          <Loading message="Loading trashbin data..." />
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Trashbin</SheetTitle>
              <SheetDescription>
                This section displays the selected trashbin’s details, including
                its name, location, waste and weight levels, and current status.
                Carefully review the information before taking any action, as
                your decision may impact collection schedules and system data
                integrity.
              </SheetDescription>
            </SheetHeader>
            <div className="mx-4 border-[1px] border-input rounded-sm p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                  <SheetTitle>Review</SheetTitle>
                  <DynamicTrashbinOperationalBadge
                    isActive={trashbin?.isActive as boolean}
                  />
                </div>
                <p>Id {trashbin?.id}</p>
                <div className="flex flex-row gap-8">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-sm text-muted-foreground">Location</h1>
                    <p className="text-sm flex flex-row gap-2 items-center wrap-anywhere">
                      <MapPin size={15} className="mt-[0.2rem]" />
                      {trashbin?.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-sm text-muted-foreground">
                      Last collected
                    </h1>
                    <p className="text-sm flex flex-row gap-2 items-center">
                      <CircleArrowUp size={15} className="mt-[0.1rem]" />
                      {formatRelativeTime(trashbin?.updatedAt as Date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-4 border-[1px] border-input rounded-sm p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center">
                  <SheetTitle>Levels</SheetTitle>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <TrashbinLevels
                    chartName="Waste Level"
                    level={Number(trashbin?.wasteLevel)}
                    status={trashbin?.wasteStatus as TrashbinStatus}
                  />
                  <TrashbinLevels
                    chartName="Weight Level"
                    level={Number(trashbin?.weightLevel)}
                    status={trashbin?.weightStatus as TrashbinStatus}
                  />
                  <TrashbinLevels
                    chartName="Battery Level"
                    level={Number(trashbin?.batteryLevel)}
                    status={trashbin?.batteryStatus as TrashbinStatus}
                  />
                </div>
              </div>
            </div>
            <SheetFooter>
              <div className="flex flex-row gap-2 w-full items-center">
                <NavigateTrashbin data={trashbin} />
                {!trashbin.isCollected && userRole === "collector" && (
                  <CollectTrashbin data={trashbin} />
                )}
                {userRole === "collector" && <ReportTrashbin data={trashbin} />}
                {userRole === "admin" && <TrashinSettings data={trashbin} />}
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContainer>
    </Sheet>
  );
};

const NavigateTrashbin = ({ data }: { data: Trashbin }) => {
  const trashbin = data;
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setStartLatLang,
    setEndLatLang,
    setRouteDirection,
    setTrashbinId,
    reset,
  } = useNavigateStore();
  const [trashbinIdParam] = useQueryState("trashbin_id");
  const [, setRouteDirectionParam] = useQueryState("route_direction");
  const [, setStartLatLangParam] = useQueryState("start_latlang");
  const [, setEndLatLangParam] = useQueryState("end_latlang");
  const handleNavigateTrashbin = (
    start: [number, number],
    end: [number, number],
  ) => {
    if (location.pathname !== "/dashboard") {
      reset();
      setStartLatLang(start.toString());
      setEndLatLang(end.toString());
      setRouteDirection("true");
      setTrashbinId(trashbinIdParam);
      navigate("/dashboard?navigate_to=true");
    }

    setStartLatLangParam(start.toString());
    setEndLatLangParam(end.toString());
    setRouteDirectionParam("true");
  };

  return (
    <Button
      className="h-12 p-4 w-[100px]"
      onClick={() =>
        handleNavigateTrashbin(
          [121.07544884155124, 14.577870676283723],
          [Number(trashbin.longitude), Number(trashbin.latitude)],
        )
      }
    >
      <Navigation className="mt-[0.1rem]" />
    </Button>
  );
};

const CollectTrashbin = ({ data }: { data: Trashbin }) => {
  const trashbin = data;
  const componentKey = "collect-trashbin";
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [collectTrashbin, setCollectTrashbin] =
    useQueryState("collect_trashbin");
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");
  const fetcher = useFetcher<TrashbinActionData>({ key: componentKey });
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";
  const handleCloseDialog = () => {
    setCollectTrashbin(null);
  };
  const actionFetcher = useUpdateTrashbinFetcher(componentKey, trashbin.id);
  const handleCollectTrashbin = () => {
    actionFetcher.submit({
      wasteLevel: "0",
      weightLevel: "0",
      wasteStatus: "empty",
      weightStatus: "empty",
      isCollected: true,
    });
  };
  const handleReviewTrashbin = () => {
    setTrashbinId(trashbin.id);
    setViewTrashbinParam("true");
  };

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Successfully collected trashbin", {
        action: {
          label: "Review",
          onClick: handleReviewTrashbin,
        },
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [actionData]);

  return (
    <Dialog
      open={!!collectTrashbin}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="h-12 p-4 grow"
          onClick={() => setCollectTrashbin("true")}
        >
          <CircleArrowUp className="mt-[0.1rem]" />
          Collect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect this trashbin?</DialogTitle>
          <DialogDescription>
            You're about to collect this trashbin. You can’t undo this action
            after confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="border-input border-[1px] bg-muted p-4 text-sm rounded-md">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <Trash />
            </div>
            <div>
              <p>Trashbin {trashbin.id}</p>
              <p className="text-muted-foreground">{trashbin.name}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCollectTrashbin} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-auto animate-spin" />}
            {!isSubmitting ? "Confirm" : "Collecting..."}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReportTrashbin = ({ data }: { data: Trashbin }) => {
  const trashbin = data;
  const loaderData = useDashboardLayoutLoader();
  const componentKey = "report-trashbin";
  const fetcher = useFetcher<TrashbinActionData>({ key: componentKey });
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";
  const [, setTrashbinId] = useQueryState("trashbin_id");
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");
  const [reportTrashbin, setReportTrashbin] = useQueryState("rt", {
    history: "replace",
  });
  const issueDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const issueNameInputRef = useRef<HTMLInputElement>(null);
  const actionFetcher = useCreateTrashbinIssueFetcher(
    componentKey,
    trashbin.id,
  );
  const handleCloseDialog = () => {
    setReportTrashbin(null);
  };
  const handleReportTrashbin = () => {
    const issueName = issueNameInputRef.current?.value || "";
    const issueDescription = issueDescriptionRef.current?.value || "";
    actionFetcher.submit({
      name: issueName,
      userId: loaderData?.userId as string,
      trashbinId: trashbin.id,
      description: issueDescription,
    });
  };
  const handleReviewTrashbin = () => {
    setTrashbinId(trashbin.id);
    setViewTrashbinParam("true");
  };

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Successfully request an issue", {
        action: {
          label: "Review",
          onClick: () => handleReviewTrashbin,
        },
      });
      setReportTrashbin(null);
      setTrashbinId(null);
    }
  }, [actionData]);

  return (
    <Dialog
      open={!!reportTrashbin}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="h-12 p-4 grow"
          variant="outline"
          onClick={() => setReportTrashbin("true")}
        >
          <CircleAlert className="mt-[0.1rem]" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this trashbin?</DialogTitle>
          <DialogDescription>
            You're about to report this trashbin. You can’t undo this action
            after confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="border-input border-[1px] bg-muted p-4 text-sm rounded-md">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <Trash />
            </div>
            <div>
              <p>Trashbin {trashbin.id}</p>
              <p className="text-muted-foreground">{trashbin.name}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <DialogTitle className="text-sm">What's the issue?</DialogTitle>
            <DialogDescription> Issue name</DialogDescription>
          </div>
          <Input
            className="h-12 p-4"
            placeholder="Issue name"
            disabled={isSubmitting}
            ref={issueNameInputRef}
          />
          <DialogDescription>Please raised your issue here.</DialogDescription>
          <Textarea
            ref={issueDescriptionRef}
            placeholder="Explain the trashbin issue"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter className="items-center">
          <Button onClick={handleReportTrashbin} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-auto animate-spin" />}
            {!isSubmitting ? "Confirm" : "Requesting issue..."}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TrashinSettings = ({ data }: { data: Trashbin }) => {
  const trashbin = data;
  const componentKey = "update-trashbin-settings";
  const [, setTrashbinId] = useQueryState("t");
  const [trashbinSettings, setTrashbinSettings] = useQueryState(
    "trashbin_settings",
    {
      history: "replace",
    },
  );
  const fetcher = useFetcher<TrashbinActionData>({ key: componentKey });
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";
  const handleCloseDialog = () => {
    setTrashbinSettings(null);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const actionFetcher = useUpdateTrashbinFetcher(componentKey, trashbin.id);
  const handleUpdateTrashbinSettings = () => {
    const trashbinName = inputRef.current?.value || trashbin.name;
    actionFetcher.submit({
      name: trashbinName,
    });
  };
  const handleReviewTrashbin = () => {
    setTrashbinId(trashbin.id);
  };

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Successfully updated trashbin settings", {
        action: {
          label: "Review",
          onClick: handleReviewTrashbin,
        },
      });
      setTrashbinSettings(null);
      setTrashbinId(null);
    }
  }, [actionData]);

  return (
    <Dialog
      open={!!trashbinSettings}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-12 p-4 grow"
          onClick={() => setTrashbinSettings("true")}
        >
          <Settings className="mt-[0.1rem]" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            You're about to update the settings of this trashbin. You can’t undo
            this action after confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="border-input border-[1px] bg-muted p-4 text-sm rounded-md">
          <div className="flex flex-row gap-4">
            <div className="mt-1">
              <Trash />
            </div>
            <div>
              <p>Trashbin {trashbin.id}</p>
              <p className="text-muted-foreground">{trashbin.name}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <DialogTitle className="text-sm">Name</DialogTitle>
            <DialogDescription>
              The trashbin location will be the trashbin name.
            </DialogDescription>
          </div>
          <Input
            ref={inputRef}
            className="h-12 p-4"
            defaultValue={trashbin.name}
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpdateTrashbinSettings}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-auto animate-spin" />}
            {!isSubmitting ? "Confirm" : "Updating..."}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewTrashbin;
