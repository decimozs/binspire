import { useEffect, useState } from "react";
import { useRouteStore } from "@/store/route-store";
import { useGetTrashbinById } from "@binspire/query";
import "@google/model-viewer";
import CollectTrashbin from "@/features/trashbin/collect-trashbin";
import { useQueryState } from "nuqs";
import { Skeleton } from "@binspire/ui/components/skeleton";
import NavigationInfo from "./navigation-info";
import CancelNavigation from "./cancel-navigation";
import { useLocation } from "@tanstack/react-router";
import Emergency from "./emergency";

export default function Navigating() {
  const { pathname } = useLocation();
  const { route } = useRouteStore();
  const [markTrashbinQuery, setMarkTrashbinQuery] =
    useQueryState("mark_trashbin_id");
  const [trashbinId, setTrashbinId] = useState<string | null>(null);

  useEffect(() => {
    const localId = localStorage.getItem("mark_trashbin_id");

    if (markTrashbinQuery) {
      localStorage.setItem("mark_trashbin_id", markTrashbinQuery);
      setTrashbinId(markTrashbinQuery);
    } else if (localId) {
      setTrashbinId(localId);
      setMarkTrashbinQuery(localId);
    } else {
      setTrashbinId(null);
    }
  }, [markTrashbinQuery]);

  const { data, isPending } = useGetTrashbinById(trashbinId || "");

  if (!route || pathname !== "/map") return null;

  const feature = route?.features?.[0];
  const distance = feature?.properties?.summary?.distance ?? 0;

  return (
    <>
      <div className="absolute top-4 w-full z-50 flex flex-row items-center gap-2 px-4 font-manrope">
        {isPending || !data ? (
          <Skeleton className="w-full h-[92px]" />
        ) : (
          <div className="bg-background/80 p-4 rounded-md w-full grid grid-cols-[1fr_80px]">
            <div>
              <p className="text-xl font-bold text-primary">Navigating</p>
              <p className="text-4xl font-bold mt-1">{data.name}</p>
              <p className="text-xl font-bold text-muted-foreground ml-[2px]">
                {(distance / 1000).toFixed(2)} km
              </p>
            </div>
            <div className="flex items-end justify-end">
              {/* @ts-ignore: model-viewer is a custom element */}
              <model-viewer
                src="/models/bin.glb"
                alt="3D Trash Bin"
                auto-rotate
                interaction-prompt="none"
                style={{
                  width: "150px",
                  height: "100px",
                  "--poster-color": "transparent",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 w-full z-50 flex flex-row items-end gap-2 px-4">
        <NavigationInfo />
        <div className="grow">
          <CollectTrashbin />
        </div>
        <div className="flex flex-col gap-4">
          <Emergency />
          <CancelNavigation />
        </div>
      </div>
    </>
  );
}
