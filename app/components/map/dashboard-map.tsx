import type { GeoJSONData, Role, Trashbin } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import Map, {
  type MapRef,
  type ViewState,
  Layer,
  MapProvider,
  Source,
} from "react-map-gl/maplibre";
import TrashbinMarker from "./trashbin-marker";
import { useQueryState } from "nuqs";
import MapZoom from "./map-zoom";
import MapLayers from "./map-layers";
import { useMapLayerStore } from "@/store/map-layers";
import MapFullscreen from "./map-fullscreen";
import { SearchTrashbin } from "./search-trashbin";
import FilterTrashbins from "./filter-trashbins";
import MapFocus from "./map-focus";
import CollectorMarker from "./collector-marker";
import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import CollectorTasks from "./collector-tasks";
import { useDirectionStore } from "@/store/direction";
import { useFetcher } from "react-router";
import type { DirectionsLoaderData } from "@/routes/resource/directions.resource";
import type { Feature, LineString } from "geojson";
import { bezierSpline } from "@turf/turf";
import UserLocation from "./user-location";
import NavigateTo from "./navigate-to";

export const INITIAL_VIEW = {
  longitude: 121.07618705298137,
  latitude: 14.577577090977371,
  zoom: 18.5,
  pitch: 70,
  bearing: 10,
};

export default function DashboardMap({ data }: { data: Trashbin[] }) {
  const [trashbinId] = useQueryState("trashbin_id");
  const fetcher = useFetcher();
  const loaderData = useDashboardLayoutLoader();
  const [wasteStatusParam] = useQueryState("waste_status");
  const [weightStatusParam] = useQueryState("weight_status");
  const [batteryStatusParam] = useQueryState("battry_status");
  const [routeDirectionParam] = useQueryState("route_direction");
  const [startLatLangParam] = useQueryState("start_latlang");
  const [endLatLangParam] = useQueryState("end_latlang");
  const mapRef = useRef<MapRef>(null);
  const { longitude, latitude, ...initialValues } = INITIAL_VIEW;
  const { layer, setLayer, setLayerImage } = useMapLayerStore();
  const { routeDirections, setRouteDirections } = useDirectionStore();

  useEffect(() => {
    const storedLayer = sessionStorage.getItem("mapLayer");

    if (storedLayer) {
      const { layer, layerImage } = JSON.parse(storedLayer);
      setLayer(layer);
      setLayerImage(layerImage);
    }
  }, []);

  useEffect(() => {
    if (!trashbinId && mapRef.current) {
      mapRef.current.flyTo({
        ...initialValues,
        center: [longitude, latitude],
        essential: true,
      });
      setRouteDirections(null);
    }
  }, [trashbinId]);

  useEffect(() => {
    if (startLatLangParam && endLatLangParam) {
      const start = startLatLangParam.split(",").map(Number);
      const end = endLatLangParam.split(",").map(Number);
      if (start.length === 2 && end.length === 2) {
        fetcher.load(
          `/resources/directions?start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`,
        );
        mapRef.current?.fitBounds(
          [
            [Math.min(start[0], end[0]), Math.min(start[1], end[1])],
            [Math.max(start[0], end[0]), Math.max(start[1], end[1])],
          ],
          {
            zoom: 17.3,
            pitch: 0,
            bearing: 0,
            essential: true,
            padding: { right: 1000 },
          },
        );
      }
    }
  }, [startLatLangParam, endLatLangParam]);

  const fetcherData = fetcher.data as DirectionsLoaderData;

  useEffect(() => {
    if (!routeDirectionParam) return;
    if (fetcherData?.success && "data" in fetcherData) {
      const directions = fetcherData.data as GeoJSONData;
      const line: Feature<LineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: directions.features[0].geometry.coordinates,
        },
      };
      const curved = bezierSpline(line);
      setRouteDirections({
        type: "FeatureCollection",
        features: [curved],
      });
    }
  }, [fetcher.data]);

  const filteredTrashbins = data.filter((bin) => {
    const matchesWaste =
      !wasteStatusParam ||
      wasteStatusParam.split(",").includes(bin.wasteStatus);
    const matchesWeight =
      !weightStatusParam ||
      weightStatusParam.split(",").includes(bin.weightStatus);
    const matchesBattery =
      !batteryStatusParam ||
      batteryStatusParam.split(",").includes(bin.batteryStatus);

    return matchesWaste && matchesWeight && matchesBattery;
  });

  return (
    <MapProvider>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
        mapStyle={`https://api.maptiler.com/maps/${layer}/style.json?key=lpSC877eGSU58dUzI0rw`}
        onClick={(e) => console.log(e.lngLat)}
      >
        <CollectorMarker role={loaderData?.user?.role as Role} />
        <TrashbinMarker data={filteredTrashbins} />
        <div className="absolute top-4 left-4 flex flex-col gap-4">
          <SearchTrashbin data={data} />
          <FilterTrashbins />
          <CollectorTasks data={data} role={loaderData?.user?.role as Role} />
        </div>
        <MapLayers />
        <NavigateTo />
        <div className="fixed right-8 bottom-8 rounded-md flex flex-col gap-4">
          <UserLocation />
          <MapFocus />
          <MapFullscreen />
          <MapZoom />
        </div>
        {routeDirections && (
          <Source id="route-line" type="geojson" data={routeDirections}>
            <Layer
              id="route-line"
              type="line"
              key={`route-${routeDirections.features[0].geometry.bbox}`}
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
              paint={{
                "line-color": "black",
                "line-width": 10,
              }}
            />
          </Source>
        )}
      </Map>
    </MapProvider>
  );
}
