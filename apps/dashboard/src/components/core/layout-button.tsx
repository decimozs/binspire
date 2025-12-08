import { Button } from "@binspire/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
import { useLocation } from "@tanstack/react-router";
import { Expand, Shrink } from "lucide-react";
import { useLayout } from "@/store/layout-store";

export default function LayoutButton() {
  const { layout, setLayout } = useLayout();
  const location = useLocation();

  if (location.pathname === "/map") return null;

  const toggleLayout = () => {
    setLayout(layout === "compact" ? "full" : "compact");
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="h-9"
          onClick={toggleLayout}
        >
          {layout === "compact" ? <Expand /> : <Shrink />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-bold">
          {layout === "compact"
            ? "Switch to Full Layout"
            : "Switch to Compact Layout"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
