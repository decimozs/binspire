import { useEffect, useState, useRef } from "react";
import { Source, Layer, Marker, useMap } from "react-map-gl/maplibre";
import { point } from "@turf/helpers";
import bearing from "@turf/bearing";
import { useRouteStore } from "@/store/route-store";
import { useMapStore } from "@/store/map-store";
import { useLocation } from "@tanstack/react-router";

export default function RouteLayer() {
  const { pathname } = useLocation();
  const { route } = useRouteStore();
  const updateViewState = useMapStore((state) => state.updateViewState);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [userHeading, setUserHeading] = useState<number>(0);
  const { current: map } = useMap();
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!route) {
      setUserPosition(null);
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      return;
    }

    if (!map) return;

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
      padding: {
        top: 500,
      },
    });

    setUserPosition(startLocation);
    setUserHeading(routeBearing);

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

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
  }, [route, map, updateViewState]);

  if (!route) return null;

  if (pathname !== "/map") return null;

  return (
    <>
      <Source id="ors-route" type="geojson" data={route}>
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
