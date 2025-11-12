import { useEffect, useState, useRef } from "react";
import { Source, Layer, Marker, useMap } from "react-map-gl/maplibre";
import { useRouteStore } from "@/store/route-store";
import { useLocation } from "@tanstack/react-router";

export default function RouteLayer() {
  const { pathname } = useLocation();
  const { routes } = useRouteStore();
  const [, setUserPositions] = useState<Record<string, [number, number]>>({});
  const [, setUserHeadings] = useState<Record<string, number>>({});
  const { current: map } = useMap();
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!map) return;

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        setUserPositions((prev) => ({ ...prev, admin: [longitude, latitude] }));
        setUserHeadings((prev) => ({ ...prev, admin: heading || 0 }));
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
  }, [map]);

  if (pathname !== "/map") return null;

  return (
    <>
      {Object.entries(routes).map(([trashbinId, routeData]) => (
        <div key={trashbinId}>
          <Source
            id={`ors-route-${trashbinId}`}
            type="geojson"
            data={routeData.geojson}
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

          {routeData.tracker?.position && (
            <Marker
              key={`marker-${trashbinId}`}
              longitude={routeData.tracker.position[0]}
              latitude={routeData.tracker.position[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-primary border-2 border-white rounded-full" />
                <p className="text-xl text-primary bg-background">
                  {routeData.tracker.name}
                </p>
              </div>
            </Marker>
          )}
        </div>
      ))}
    </>
  );
}
