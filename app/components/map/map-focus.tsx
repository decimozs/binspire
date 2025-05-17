import { Focus } from "lucide-react";
import { Button } from "../ui/button";
import { useMap } from "react-map-gl/maplibre";
import { INITIAL_VIEW } from "./dashboard-map";

export default function MapFocus() {
  const { current: map } = useMap();
  const { longitude, latitude, ...initialValues } = INITIAL_VIEW;
  const handleMapFocus = () => {
    map?.flyTo({
      ...initialValues,
      center: [longitude, latitude],
      essential: true,
    });
  };
  return (
    <Button variant="secondary" size="icon" onClick={handleMapFocus}>
      <Focus />
    </Button>
  );
}
