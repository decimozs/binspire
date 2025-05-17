import { Locate } from "lucide-react";
import { Button } from "../ui/button";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";

export default function UserLocation() {
  const controlRef = useRef<maplibregl.GeolocateControl | null>(null);
  const { current: map } = useMap(); // gets the current maplibre-gl map instance

  useEffect(() => {
    if (map && !controlRef.current) {
      const geolocateControl = new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showAccuracyCircle: true,
      });

      controlRef.current = geolocateControl;
      map.addControl(geolocateControl);

      // Listen to geolocate event and fly to position
      geolocateControl.on("geolocate", (e) => {
        const { longitude, latitude } = e.coords;
        map.flyTo({
          center: [longitude, latitude],
          zoom: 17,
          speed: 1.2,
          curve: 1.42,
          essential: true,
        });
      });
    }
  }, [map]);

  const handleLocateCurrentUserLocation = () => {
    console.log("location button click");
    controlRef.current?.trigger(); // starts location tracking
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleLocateCurrentUserLocation}
    >
      <Locate />
    </Button>
  );
}
