import { Button } from "@binspire/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import Map, { useControl, type ViewState } from "react-map-gl/maplibre";
import ZoomControls from "./zoom-controls";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ResetMapStateButton from "./reset-map-state-button";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { type DeckProps } from "@deck.gl/core";
import { useTrashbinLayer } from "@/hooks/use-trashbin-layer";
import {
  useGetAllTrashbins,
  useGetOrganizationSettingsById,
} from "@binspire/query";
import { useMapLayer } from "@/hooks/use-map-layer";
import { Skeleton } from "@binspire/ui/components/skeleton";
import FilterTrashbin from "./filter-trashbin";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useFilterTrashbin } from "@/hooks/use-filter-trashbin";
import { TRASHBIN_CONFIG } from "@binspire/shared";
import AvailableCollectors from "./available-collectors";
import MapLegend from "./map-legend";
import LiveUpdates from "./live-updates";
import MonitoringMode from "./monitoring-mode";
import { useMonitoringStore } from "@/store/monitoring-store";

interface Props {
  isFullScreen?: boolean;
}

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function GlobalMap({ isFullScreen = true }: Props) {
  const { data: trashbins, isPending: isTrashbinsPending } =
    useGetAllTrashbins();
  const bins = useTrashbinRealtime((state) => state.bins);
  const {
    departmentQuery,
    wasteLevelQuery,
    weightLevelQuery,
    batteryLevelQuery,
    collectedQuery,
    scheduledQuery,
    operationalQuery,
    archivedQuery,
  } = useFilterTrashbin();
  const { mapStyle } = useMapLayer();
  const navigate = useNavigate();
  const session = authClient.useSession();
  const { data: settings, isPending: isSettingsPending } =
    useGetOrganizationSettingsById(session.data?.user.orgId as string);
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 18,
    pitch: 70,
    bearing: 10,
  });
  const { enabled } = useMonitoringStore();

  const trashbinsWithLevel = useMemo(() => {
    if (!trashbins) return [];

    return trashbins.map((bin) => {
      const realtime = bins[bin.id];
      const MAX_DISTANCE = 53;

      const fillLevel =
        realtime?.wasteLevel !== undefined
          ? Math.max(
              0,
              Math.min(
                100,
                ((MAX_DISTANCE - realtime.wasteLevel) / MAX_DISTANCE) * 100,
              ),
            )
          : 0;

      return {
        ...bin,
        wasteLevel: fillLevel,
        weightLevel: realtime?.weightLevel ?? 0,
        batteryLevel: realtime?.batteryLevel ?? 0,
      };
    });
  }, [trashbins, bins]);

  const filteredTrashbins = useMemo(() => {
    return trashbinsWithLevel.filter((trashbin) => {
      const matchesDepartment =
        departmentQuery === "general" ||
        trashbin.department === departmentQuery;

      const matchesWasteLevel =
        wasteLevelQuery === "all" ||
        (() => {
          const levelConfig = TRASHBIN_CONFIG["waste-level"];
          const value = trashbin.wasteLevel;
          switch (wasteLevelQuery) {
            case "empty":
              return value <= levelConfig.low.value;
            case "low":
              return (
                value > levelConfig.low.value &&
                value < levelConfig["almost-full"].value
              );
            case "almost-full":
              return (
                value >= levelConfig["almost-full"].value &&
                value < levelConfig.full.value
              );
            case "full":
              return (
                value >= levelConfig.full.value &&
                value < levelConfig.overflowing.value
              );
            case "overflowing":
              return value >= levelConfig.overflowing.value;
            default:
              return true;
          }
        })();

      const matchesWeightLevel =
        weightLevelQuery === "all" ||
        (() => {
          const levelConfig = TRASHBIN_CONFIG["weight-level"];
          const value = trashbin.weightLevel;
          switch (weightLevelQuery) {
            case "light":
              return value < levelConfig.medium.value;
            case "medium":
              return (
                value >= levelConfig.medium.value &&
                value < levelConfig.heavy.value
              );
            case "heavy":
              return (
                value >= levelConfig.heavy.value &&
                value < levelConfig.overloaded.value
              );
            case "overloaded":
              return value >= levelConfig.overloaded.value;
            default:
              return true;
          }
        })();

      const matchesBatteryLevel =
        batteryLevelQuery === "all" ||
        (() => {
          const levelConfig = TRASHBIN_CONFIG["battery-level"];
          const value = trashbin.batteryLevel;
          switch (batteryLevelQuery) {
            case "critical":
              return value <= levelConfig.low.value;
            case "low":
              return (
                value > levelConfig.low.value &&
                value < levelConfig.medium.value
              );
            case "medium":
              return (
                value >= levelConfig.medium.value &&
                value < levelConfig.full.value
              );
            case "full":
              return value >= levelConfig.full.value;
            default:
              return true;
          }
        })();

      const matchesCollected =
        collectedQuery === "all" ||
        (collectedQuery === "true" && trashbin.status?.isCollected) ||
        (collectedQuery === "false" && !trashbin.status?.isCollected);

      const matchesScheduled =
        scheduledQuery === "all" ||
        (scheduledQuery === "true" && trashbin.status?.isScheduled) ||
        (scheduledQuery === "false" && !trashbin.status?.isScheduled);

      const matchesOperational =
        operationalQuery === "all" ||
        (operationalQuery === "true" && trashbin.status?.isOperational) ||
        (operationalQuery === "false" && !trashbin.status?.isOperational);

      const matchesArchived =
        archivedQuery === "all" ||
        (archivedQuery === "true" && trashbin.status?.isArchived) ||
        (archivedQuery === "false" && !trashbin.status?.isArchived);

      return (
        matchesDepartment &&
        matchesWasteLevel &&
        matchesWeightLevel &&
        matchesBatteryLevel &&
        matchesCollected &&
        matchesScheduled &&
        matchesOperational &&
        matchesArchived
      );
    });
  }, [
    trashbinsWithLevel,
    departmentQuery,
    wasteLevelQuery,
    weightLevelQuery,
    batteryLevelQuery,
    collectedQuery,
    scheduledQuery,
    operationalQuery,
    archivedQuery,
  ]);

  const trashbinLayers = useTrashbinLayer(filteredTrashbins);

  const currentSettings = settings?.settings;

  const MemoizedDeckOverlay = useMemo(
    () =>
      trashbinLayers.length > 0 && <DeckGLOverlay layers={trashbinLayers} />,
    [trashbinLayers],
  );

  useEffect(() => {
    const loc = currentSettings?.general?.location;

    if (loc) {
      queueMicrotask(() => {
        setViewState({
          longitude: loc.lng,
          latitude: loc.lat,
          zoom: 18,
          pitch: 70,
          bearing: 10,
        });
      });
    }
  }, [currentSettings]);

  if (!isFullScreen && (isSettingsPending || isTrashbinsPending)) {
    return <Skeleton className="w-full h-[650px]" />;
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: isFullScreen ? 0 : "8px",
      }}
      mapStyle={mapStyle}
    >
      {MemoizedDeckOverlay}
      {!isFullScreen ? (
        <>
          <div className="relative w-full h-[400px]">
            <div className="w-full h-[650px] absolute top-0 left-0" />
          </div>
          <Button
            size="sm"
            className="w-fit absolute right-6 bottom-6 hover:transition-transform duration-200 hover:scale-150"
            onClick={() => navigate({ to: "/map" })}
          >
            <ArrowUpRight />
          </Button>
        </>
      ) : (
        <>
          {!enabled && (
            <div className="flex flex-col items-start gap-4 fixed left-3 top-16">
              <FilterTrashbin />
              <AvailableCollectors />
              <MapLegend />
            </div>
          )}
          {enabled ? (
            <div className="flex flex-col gap-4 fixed right-4 bottom-4">
              <MonitoringMode />
            </div>
          ) : (
            <div className="flex flex-col gap-4 fixed right-4 top-1/2 -translate-y-1/2">
              <MonitoringMode />
              <ResetMapStateButton />
              <ZoomControls />
            </div>
          )}
          {!enabled && (
            <div className="fixed bottom-4 left-4 z-10">
              <LiveUpdates />
            </div>
          )}
        </>
      )}
    </Map>
  );
}
