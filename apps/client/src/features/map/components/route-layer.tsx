import { useEffect, useState, useRef } from "react";
import { Source, Layer, Marker, useMap } from "react-map-gl/maplibre";
import { point } from "@turf/helpers";
import { distance as turfDistance } from "@turf/distance";
import bearing from "@turf/bearing";
import { useRouteStore } from "@/store/route-store";
import { useMapStore } from "@/store/map-store";
import { useLocation } from "@tanstack/react-router";
import { useMqtt } from "@/context/mqtt-provider";
import { useSession } from "@/features/auth";
import { useQueryState } from "nuqs";

export default function RouteLayer() {
  const { client } = useMqtt();
  const session = useSession();
  const [markTrashbinId] = useQueryState("mark_trashbin_id");
  const { pathname } = useLocation();
  const { route } = useRouteStore();
  const updateViewState = useMapStore((state) => state.updateViewState);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [userHeading, setUserHeading] = useState<number>(0);
  const { current: map } = useMap();
  const watchId = useRef<number | null>(null);
  const [remainingRoute, setRemainingRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!route) return;

    const feature = route.features?.[0];
    if (!feature || feature.geometry.type !== "LineString") return;

    setRemainingRoute([...feature.geometry.coordinates] as [number, number][]);
  }, [route]);

  useEffect(() => {
    if (!route || !map) return;

    const feature = route.features?.[0];
    if (!feature || feature.geometry.type !== "LineString") return;

    const coordinates = feature.geometry.coordinates;
    if (!coordinates || coordinates.length < 2) return;

    const start = point(coordinates[0]);
    const end = point(coordinates[coordinates.length - 1]);
    const routeBearing = bearing(start, end);
    const startLocation = coordinates[0] as [number, number];

    updateViewState({
      longitude: startLocation[0],
      latitude: startLocation[1],
      zoom: 18,
      bearing: routeBearing,
      pitch: 70,
      padding: { top: 500 },
    });

    setUserPosition(startLocation);
    setUserHeading(routeBearing);

    if (watchId.current !== null)
      navigator.geolocation.clearWatch(watchId.current);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        const currentHeading = heading ?? map.getBearing();

        map.easeTo({
          center: [longitude, latitude],
          zoom: 17,
          bearing: currentHeading,
          pitch: 70,
          padding: { top: 500 },
        });

        setUserPosition([longitude, latitude]);
        setUserHeading(currentHeading);

        setRemainingRoute((prevCoords) => {
          if (!prevCoords.length) return prevCoords;
          return prevCoords.filter(([lng, lat]) => {
            const dist = turfDistance(
              point([lng, lat]),
              point([longitude, latitude]),
              { units: "meters" },
            );
            return dist > 5;
          });
        });

        if (client && session.data?.user) {
          client.publish(
            `trashbin/${markTrashbinId}/tracking`,
            JSON.stringify({
              userId: session.data.user.id,
              name: session.data.user.name,
              trashbinId: markTrashbinId,
              status: "update-position",
              position: [longitude, latitude],
            }),
          );
        }
      },
      (error) => console.error("Error tracking location:", error),
      { enableHighAccuracy: true, maximumAge: 1000 },
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [route, map, updateViewState, client, session, markTrashbinId]);

  if (!route || pathname !== "/map") return null;

  return (
    <>
      <Source
        id="ors-route"
        type="geojson"
        data={{
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: remainingRoute },
        }}
      >
        <Layer
          id="ors-route-line"
          type="line"
          paint={{
            "line-color": "#7BE1C9",
            "line-width": 5,
            "line-opacity": 0.8,
          }}
        />
      </Source>

      {userPosition && (
        <Marker
          longitude={userPosition[0]}
          latitude={userPosition[1]}
          anchor="center"
          rotation={userHeading}
        >
          <div className="w-6 h-6 bg-primary border-2 border-white rounded-full relative">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3
              border-l-6 border-r-6 border-b-12
              border-b-white border-l-transparent border-r-transparent"
            />
          </div>
        </Marker>
      )}
    </>
  );
}
