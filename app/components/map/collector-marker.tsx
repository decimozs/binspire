import { MapPin, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { Marker } from "react-map-gl/maplibre";
import type { Role } from "@/lib/types";

export default function CollectorMarker({ role }: { role: Role }) {
  return (
    <Marker latitude={14.577870676283723} longitude={121.07544884155124}>
      <Button size="icon">{role === "admin" ? <Truck /> : <MapPin />}</Button>
    </Marker>
  );
}
