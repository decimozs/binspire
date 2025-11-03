import { useEffect, useRef, useState } from "react";
import { Button } from "@binspire/ui/components/button";
import { Navigation, NavigationOff } from "lucide-react";
import { Marker, useMap } from "react-map-gl/maplibre";

export default function LocateButton() {
  const { current: map } = useMap();
  const watchId = useRef<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  const startTracking = () => {
    if (!navigator.geolocation || !map) return;

    if (!tracking) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;

          map.easeTo({
            center: [longitude, latitude],
            zoom: 17,
            bearing: heading ?? map.getBearing(),
          });

          setCurrentPosition([longitude, latitude]);
        },
        (error) => console.error("Error tracking location:", error),
        { enableHighAccuracy: true, maximumAge: 1000 },
      );

      setTracking(true);
    } else {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        setTracking(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null)
        navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={startTracking}>
        {!tracking ? <Navigation /> : <NavigationOff />}
      </Button>
      {currentPosition && tracking && (
        <Marker
          longitude={currentPosition[0]}
          latitude={currentPosition[1]}
          anchor="center"
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
    </div>
  );
}
