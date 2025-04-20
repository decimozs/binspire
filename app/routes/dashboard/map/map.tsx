import { useState } from "react";
import Map, { type ViewState, Marker } from "react-map-gl/maplibre";

export default function DashboardMap() {
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 121.07618705298137,
    latitude: 14.577577090977371,
    zoom: 18,
    pitch: 60,
    bearing: 10,
  });

  const baseLat = 14.577577090977371;
  const baseLng = 121.07618705298137;

  const trashbinMarkers = [
    {
      id: 1,
      longitude: baseLng,
      latitude: baseLat,
      fill: "lightgreen",
    },

    {
      id: 2,
      longitude: 121.0753926175388,
      latitude: 14.577140015172816,
      fill: "red",
    },
    {
      id: 3,
      longitude: 121.0769634213367,
      latitude: 14.57885081135386,
      fill: "orange",
    },
  ];

  const userMarkers = [
    {
      id: 1,
      longitude: 121.07736377204242,
      latitude: 14.577828025479434,
      image: "/collector.png",
    },
    {
      id: 2,
      longitude: 121.07462429636166,
      latitude: 14.578503892923749,
      image: "/collector.png",
    },
  ];

  return (
    <Map
      {...viewState}
      style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=lpSC877eGSU58dUzI0rw`}
      onMove={(e) => setViewState(e.viewState)}
      onClick={(e) => {
        console.log(e.lngLat.wrap());
      }}
    >
      {trashbinMarkers.map((marker) => (
        <Marker
          key={marker.id}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill={marker.fill}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-icon lucide-trash"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Marker>
      ))}
      {userMarkers.map((marker) => (
        <Marker
          key={marker.id}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
        >
          <img src={marker.image} className="h-15 w-20" />
        </Marker>
      ))}
    </Map>
  );
}
