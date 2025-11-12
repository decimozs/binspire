import Map, {
  Marker,
  type MapRef,
  type MarkerDragEvent,
} from "react-map-gl/maplibre";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useMapLayer } from "@/hooks/use-map-layer";
import { usePermissionStore } from "@/store/permission-store";
import { ors } from "@/features/ors";
import { LocateFixed } from "lucide-react";

interface DraggableMapProps {
  position: { lat: number; lng: number };
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}

export default function DraggableMap({
  position,
  onPositionChange,
}: DraggableMapProps) {
  const mapRef = useRef<MapRef>(null);
  const { permission } = usePermissionStore();
  const { settingsMapStyle } = useMapLayer();
  const [marker, setMarker] = useState(position);
  const [address, setAddress] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);
  const [locating, setLocating] = useState(false);

  const hasPermission = permission.settingsManagement?.actions.update;
  const mapStyle = useMemo(() => settingsMapStyle, [settingsMapStyle]);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setIsFetching(true);

    try {
      const res = await ors.geocoding.reverse({
        "point.lat": lat,
        "point.lon": lng,
        size: 1,
      });

      const place =
        res.features?.[0]?.properties?.label ||
        res.features?.[0]?.properties?.name ||
        "Unknown location";

      setAddress(place);
    } catch (err) {
      console.error("ORS Reverse Geocoding failed:", err);
      setAddress("Unable to fetch address");
    } finally {
      setIsFetching(false);
    }
  }, []);

  const onMarkerDrag = useCallback(
    (event: MarkerDragEvent) => {
      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;
      const newPos = { lng, lat };
      setMarker(newPos);
      onPositionChange(newPos);
    },
    [onPositionChange],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAddress(marker.lat, marker.lng);
    }, 800);
    return () => clearTimeout(handler);
  }, [marker, fetchAddress]);

  useEffect(() => {
    if (
      Math.abs(marker.lat - position.lat) > 0.0001 ||
      Math.abs(marker.lng - position.lng) > 0.0001
    ) {
      setMarker(position);
      mapRef.current?.flyTo({
        center: [position.lng, position.lat],
        zoom: 15,
        essential: false,
      });
    }
  }, [position]);

  const handleLocate = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = { lat: latitude, lng: longitude };
        setMarker(newPos);
        onPositionChange(newPos);
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          essential: true,
        });
        fetchAddress(latitude, longitude);
        setLocating(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Unable to retrieve your location.");
        setLocating(false);
      },
    );
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <Map
        ref={mapRef}
        reuseMaps
        styleDiffing
        dragRotate={false}
        touchZoomRotate
        scrollZoom
        initialViewState={{
          longitude: marker.lng,
          latitude: marker.lat,
          zoom: 15,
        }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
        }}
        mapStyle={mapStyle}
        interactive={hasPermission}
      >
        <Marker
          longitude={marker.lng}
          latitude={marker.lat}
          draggable={hasPermission}
          onDrag={onMarkerDrag}
        >
          <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-md" />
        </Marker>
      </Map>

      <div className="absolute bottom-3 left-3 bg-background text-primary backdrop-blur-sm rounded-md px-3 py-2 text-xs shadow-md font-mono space-y-1 max-w-xs">
        <div className="font-sans text-gray-600 break-words text-primary font-bold">
          {isFetching ? (
            <p className="text-muted-foreground">Searching...</p>
          ) : (
            <>📍 {address || "No address available"}</>
          )}
        </div>
      </div>

      <button
        onClick={handleLocate}
        disabled={locating}
        className="absolute top-3 right-3 z-10 bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-md p-2 transition-all duration-150 disabled:opacity-50"
        title="Locate Me"
      >
        {locating ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <LocateFixed className="w-4 h-4" />
        )}
      </button>

      {!hasPermission && (
        <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-[1px] cursor-not-allowed" />
      )}
    </div>
  );
}
