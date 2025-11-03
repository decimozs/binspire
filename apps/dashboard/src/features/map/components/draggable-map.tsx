import Map, {
  Marker,
  type MapRef,
  type MarkerDragEvent,
} from "react-map-gl/maplibre";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useMapLayer } from "@/hooks/use-map-layer";
import { usePermissionStore } from "@/store/permission-store";

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

  const hasPermission = permission.settingsManagement?.actions.update;

  const mapStyle = useMemo(() => settingsMapStyle, [settingsMapStyle]);

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

      {!hasPermission && (
        <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-[1px] cursor-not-allowed" />
      )}
    </div>
  );
}
