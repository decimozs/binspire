import { useState } from "react";
import Map, { type ViewState, MapProvider } from "react-map-gl/maplibre";

export default function DashboardMap() {
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 121.07618705298137,
    latitude: 14.577577090977371,
    zoom: 18,
    pitch: 60,
    bearing: 10,
  });

  return (
    <MapProvider>
      <Map
        {...viewState}
        style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
        mapStyle={`https://api.maptiler.com/maps/0196585a-8568-78da-9d4f-9e0a23f2efd9/style.json?key=lpSC877eGSU58dUzI0rw`}
        onMove={(e) => setViewState(e.viewState)}
      ></Map>
    </MapProvider>
  );
}
