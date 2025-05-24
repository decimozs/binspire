import { Navigation, X } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryState } from "nuqs";
import { useNavigateStore } from "@/store/navigate.store";
import { useState } from "react";

export default function NavigateTo() {
  const [navigate, setNavigate] = useState(false);
  const { startLatLang, endLatLang, reset, routeDirection, trashbinId } =
    useNavigateStore();
  const [, setTrashbinIdParam] = useQueryState("trashbin_id");
  const [, setRouteDirectionParam] = useQueryState("route_direction");
  const [, setStartLatLangParam] = useQueryState("start_latlang");
  const [, setEndLatLangParam] = useQueryState("end_latlang");
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");

  const [navigateToParam, setNavigatToParam] = useQueryState("navigate_to");

  if (!navigateToParam) return null;

  const handleNavigateTo = () => {
    console.log("navigate nav");
    setNavigate(true);
    setTrashbinIdParam(trashbinId);
    setViewTrashbinParam("true");
    setStartLatLangParam(startLatLang);
    setEndLatLangParam(endLatLang);
    setRouteDirectionParam(routeDirection);
  };

  const handleResetNavigation = () => {
    reset();
    setNavigatToParam(null);
    setTrashbinIdParam(null);
    setViewTrashbinParam(null);
    setStartLatLangParam(null);
    setEndLatLangParam(null);
    setRouteDirectionParam(null);
  };

  return (
    <Button
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-full h-[3.5rem] w-[3.5rem]"
      onClick={!navigate ? handleNavigateTo : handleResetNavigation}
    >
      {!navigate ? <Navigation /> : <X />}
    </Button>
  );
}
