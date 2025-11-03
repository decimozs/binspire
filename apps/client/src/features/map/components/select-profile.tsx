import { ShowToast } from "@/components/toast";
import { ors } from "@/features/directions";
import { useRouteStore } from "@/store/route-store";
import { Button } from "@binspire/ui/components/button";
import { Car, Footprints, Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

export default function SelectProfile() {
  const [loading, setLoading] = useState<"driving-car" | "foot-walking" | null>(
    null,
  );
  const { setRoute } = useRouteStore();
  const [trashbinId, setTrashbinQuery] = useQueryState("trashbin_id");
  const [, setMarkTrashbinQuery] = useQueryState("mark_trashbin_id");
  const [, setSelectProfileQuery] = useQueryState("select_profile");
  const [latQuery, setLatQuery] = useQueryState("lat");
  const [lngQuery, setLngQuery] = useQueryState("lng");

  const getUserLocation = (): Promise<[number, number]> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
          reject,
        );
      }
    });

  const handleGetDirection = async (
    profile: "driving-car" | "foot-walking",
  ) => {
    try {
      setLoading(profile);

      const userCoords = await getUserLocation();
      const destination: [number, number] = [
        Number(lngQuery),
        Number(latQuery),
      ];

      const routes = await ors.directions.calculateRouteGeoJSON(profile, {
        coordinates: [userCoords, destination],
      });

      setRoute(routes as unknown as GeoJSON.FeatureCollection);
    } catch (err) {
      console.error(err);
      ShowToast("error", "Failed to get directions. Please try again.");
    } finally {
      setLoading(null);
      setTrashbinQuery(null);
      setMarkTrashbinQuery(trashbinId);
      setLatQuery(null);
      setLngQuery(null);
      setSelectProfileQuery(null);
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        className="grow"
        disabled={!!loading}
        onClick={() => handleGetDirection("driving-car")}
      >
        {loading === "driving-car" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Car />
            <p className="ml-2">Drive Mode</p>
          </>
        )}
      </Button>

      <Button
        className="grow"
        disabled={!!loading}
        onClick={() => handleGetDirection("foot-walking")}
      >
        {loading === "foot-walking" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Footprints />
            <p className="ml-2">Walk Mode</p>
          </>
        )}
      </Button>
    </div>
  );
}
