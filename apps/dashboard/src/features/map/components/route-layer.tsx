import { useEffect, useState, useRef } from "react";
import { Source, Layer, Marker, useMap } from "react-map-gl/maplibre";
import { point } from "@turf/helpers";
import { distance as turfDistance } from "@turf/distance";
import { useRouteStore } from "@/store/route-store";
import { useLocation } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { getInitial } from "@binspire/shared";
import { UserApi } from "@binspire/query";

interface UserDetails {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface TrackerState {
  position: [number, number] | null;
  remainingRoute: [number, number][];
}

export default function RouteLayer() {
  const { pathname } = useLocation();
  const { routes } = useRouteStore();
  const { current: map } = useMap();
  const watchId = useRef<number | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>(
    {},
  );
  const [trackers, setTrackers] = useState<Record<string, TrackerState>>({});

  const isValidCoord = ([lng, lat]: [number, number]) =>
    typeof lng === "number" &&
    typeof lat === "number" &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90;

  useEffect(() => {
    Object.values(routes).forEach(async (routeData) => {
      const userId = routeData.tracker?.userId;
      if (!userId || userDetails[userId]) return;

      try {
        const user = await UserApi.getById(userId);
        setUserDetails((prev) => ({
          ...prev,
          [userId]: {
            id: user.id,
            name: user.name,
            avatarUrl: user.image || undefined,
          },
        }));
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    });
  }, [routes, userDetails]);

  useEffect(() => {
    Object.entries(routes).forEach(([trashbinId, routeData]) => {
      if (
        !routeData.tracker?.position ||
        !isValidCoord(routeData.tracker.position)
      )
        return;

      const coordinates =
        routeData.geojson.features?.[0]?.geometry.type === "LineString"
          ? ([...routeData.geojson.features[0].geometry.coordinates] as [
              number,
              number,
            ][])
          : [];

      setTrackers((prev) => ({
        ...prev,
        [trashbinId]: {
          position: routeData.tracker?.position || null,
          remainingRoute: coordinates,
        },
      }));
    });
  }, [routes]);

  useEffect(() => {
    if (!map) return;
    if (watchId.current !== null)
      navigator.geolocation.clearWatch(watchId.current);

    watchId.current = navigator.geolocation.watchPosition(
      () => {},
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 1000 },
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [map]);

  if (pathname !== "/map") return null;

  return (
    <>
      {Object.entries(routes).map(([trashbinId, routeData]) => {
        const tracker = trackers[trashbinId];
        const userId = routeData.tracker?.userId;
        const user = userId ? userDetails[userId] : undefined;

        if (!tracker) return null;

        const updatedRemaining = tracker.remainingRoute.filter(([lng, lat]) => {
          if (!tracker.position) return true;
          const dist = turfDistance(
            point([lng, lat]),
            point(tracker.position),
            { units: "meters" },
          );
          return dist > 5;
        });

        if (updatedRemaining.length !== tracker.remainingRoute.length) {
          setTrackers((prev) => ({
            ...prev,
            [trashbinId]: {
              ...prev[trashbinId],
              remainingRoute: updatedRemaining,
            },
          }));
        }

        const destination =
          updatedRemaining[updatedRemaining.length - 1] || null;

        return (
          <div key={trashbinId}>
            <Source
              id={`ors-route-${trashbinId}`}
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: updatedRemaining },
              }}
            >
              <Layer
                id={`ors-route-line-${trashbinId}`}
                type="line"
                paint={{
                  "line-color": "#7BE1C9",
                  "line-width": 15,
                  "line-opacity": 0.8,
                }}
              />
            </Source>

            {tracker.position && user && isValidCoord(tracker.position) && (
              <Marker
                key={`marker-${trashbinId}`}
                longitude={tracker.position[0]}
                latitude={tracker.position[1]}
                anchor="bottom"
              >
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center gap-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/30 px-4 py-3 rounded-md mb-2 font-bold border-[2px] border-primary">
                    <Avatar className="size-15">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                      <AvatarFallback className="text-xl">
                        {getInitial(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-2xl text-primary">{user.name}</p>
                  </div>
                  <div className="w-6 h-6 bg-primary border-2 border-white rounded-full" />
                </div>
              </Marker>
            )}

            {destination && isValidCoord(destination) && (
              <Marker
                key={`destination-${trashbinId}`}
                longitude={destination[0]}
                latitude={destination[1]}
                anchor="bottom"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex w-8 h-8 rounded-full bg-primary opacity-75 animate-ping"></span>
                </div>
              </Marker>
            )}
          </div>
        );
      })}
    </>
  );
}
