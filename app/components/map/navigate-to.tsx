import { Navigation } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryState } from "nuqs";
import { useNavigateStore } from "@/store/navigate";

export default function NavigateTo() {
  const { startLatLang, endLatLang, routeDirection, trashbinId } =
    useNavigateStore();
  const [, setTrashbinIdParam] = useQueryState("trashbin_id");
  const [, setRouteDirectionParam] = useQueryState("route_direction");
  const [, setStartLatLangParam] = useQueryState("start_latlang");
  const [, setEndLatLangParam] = useQueryState("end_latlang");
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");

  const [navigateToParam] = useQueryState("navigate_to");

  if (!navigateToParam) return null;

  const handleNavigateTo = () => {
    setTrashbinIdParam(trashbinId);
    setViewTrashbinParam("true");
    setStartLatLangParam(startLatLang);
    setEndLatLangParam(endLatLang);
    setRouteDirectionParam(routeDirection);
  };

  return (
    <Button
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-full h-[3.5rem] w-[3.5rem]"
      onClick={handleNavigateTo}
    >
      <Navigation />
    </Button>
  );
}
