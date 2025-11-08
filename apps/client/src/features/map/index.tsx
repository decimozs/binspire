import Map, { useControl } from "react-map-gl/maplibre";
import ZoomControls from "./components/zoom-controls";
import ResetMapState from "./components/reset-map-state";
import { useEffect, useMemo } from "react";
import { useSession } from "../auth";
import {
  useGetAllTrashbins,
  useGetOrganizationSettingsById,
} from "@binspire/query";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { type DeckProps } from "@deck.gl/core";
import { useTrashbinRealtime } from "@/store/realtime-store";
import {
  useTrashbinLayer,
  type TrashbinWithLevel,
} from "@/hooks/use-trashbin-layer";
import { useFilterTrashbin } from "@/hooks/use-filter-trashbin";
import { TRASHBIN_CONFIG } from "@binspire/shared";
import { parseAsBoolean, useQueryState } from "nuqs";
import Back from "./components/back-button";
import ViewTrashbin from "../trashbin/view-trashbin";
import AssignedTrashbins from "../trashbin/assigned-trashbins";
import TrashbinIssues from "../trashbin/trashbin-issues";
import RouteLayer from "./components/route-layer";
import { useRouteStore } from "@/store/route-store";
import Navigating from "./components/navigating";
import { useMapStore } from "@/store/map-store";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@binspire/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import ReportIssue from "../report-issue";
import MapLegend from "./components/map-legend";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);

  return null;
}

function TrashbinLayers({ trashbins }: { trashbins: TrashbinWithLevel[] }) {
  const layers = useTrashbinLayer(trashbins);
  return <DeckGLOverlay layers={layers} />;
}

export default function GlobalMap({
  isOnHome = false,
}: {
  isOnHome?: boolean;
}) {
  const session = useSession();
  const { route } = useRouteStore();
  const { viewState, setViewState, resetViewState } = useMapStore();
  const { data: trashbins } = useGetAllTrashbins();
  const { pathname } = useLocation();
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
  const { data: settings } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );
  const [assignedTrashbinsQuery] = useQueryState(
    "assigned_trashbins",
    parseAsBoolean.withDefault(false),
  );
  const [trashbinIssuesQuery] = useQueryState(
    "trashbin_issues",
    parseAsBoolean.withDefault(false),
  );

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
        (collectedQuery === "collected" && trashbin.status.isCollected) ||
        (collectedQuery === "not-collected" && !trashbin.status.isCollected);

      const matchesScheduled =
        scheduledQuery === "all" ||
        (scheduledQuery === "scheduled" && trashbin.status.isScheduled) ||
        (scheduledQuery === "not-scheduled" && !trashbin.status.isScheduled);

      const matchesOperational =
        operationalQuery === "all" ||
        (operationalQuery === "operational" && trashbin.status.isOperational) ||
        (operationalQuery === "non-operational" &&
          !trashbin.status.isOperational);

      const matchesArchived =
        archivedQuery === "all" ||
        (archivedQuery === "archived" && trashbin.status.isArchived) ||
        (archivedQuery === "active" && !trashbin.status.isArchived);

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

  const currentSettings = settings?.settings;

  useEffect(() => {
    const loc = currentSettings?.general?.location;

    if (loc) {
      resetViewState({
        longitude: loc.lng,
        latitude: loc.lat,
        zoom: 16.5,
        pitch: 70,
        bearing: 10,
        padding: {
          bottom: 0,
        },
      });
    }

    if (loc && pathname === "/" && isOnHome === true) {
      resetViewState({
        longitude: loc.lng,
        latitude: loc.lat,
        zoom: 16.5,
        pitch: 70,
        bearing: 10,
        padding: {
          bottom: 0,
        },
      });
    }
  }, [currentSettings, resetViewState, pathname, isOnHome]);

  return (
    <main className={isOnHome ? "w-full h-[400px]" : "w-full h-screen"}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: isOnHome ? "8px" : "0",
        }}
        mapStyle={`https://api.maptiler.com/maps/019806b1-7482-71db-96b3-1ee247f83d51/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`}
      >
        {isOnHome && (
          <div className="relative w-full h-[400px]">
            <div className="w-full h-[400px] absolute top-0 left-0" />
          </div>
        )}
        {!isOnHome && !route && (
          <div className="fixed right-4 top-4 z-50">
            <ReportIssue label="Report Map" entity="mapManagement" />
          </div>
        )}
        <RouteLayer />
        <TrashbinLayers trashbins={filteredTrashbins} />
        {assignedTrashbinsQuery ||
        trashbinIssuesQuery ||
        isOnHome ||
        route ? null : (
          <>
            <div className="fixed right-4 bottom-4 flex flex-col gap-4 z-50">
              <ResetMapState />
              <ZoomControls />
            </div>
          </>
        )}
        {!isOnHome && !route && (
          <div className="fixed left-4 top-4 flex flex-col gap-4">
            <Back />
            <MapLegend />
          </div>
        )}
        {!isOnHome && !route && (
          <div className="fixed left-4 bottom-4 flex flex-col gap-4">
            <AssignedTrashbins />
            <TrashbinIssues />
          </div>
        )}
        <ViewTrashbin />
        <Navigating />
        {isOnHome && (
          <Link to="/map" className="absolute bottom-4 right-4 z-50">
            <Button className="w-full" variant="default">
              <ArrowUpRight />
            </Button>
          </Link>
        )}
      </Map>
    </main>
  );
}
