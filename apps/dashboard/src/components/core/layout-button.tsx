import { Button } from "@binspire/ui/components/button";
import { Check, Expand, LayoutPanelLeft, Shrink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { useLayout } from "@/store/layout-store";
import { useLocation } from "@tanstack/react-router";

export default function LayoutButton() {
  const { layout, setLayout } = useLayout();
  const location = useLocation();

  if (location.pathname === "/map") return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9">
          <LayoutPanelLeft />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setLayout("compact")}
          className="flex flex-row justify-between items-center"
        >
          <div className="flex flex-row items-center gap-2">
            <Shrink />
            Compact
          </div>
          {layout === "compact" && <Check />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLayout("full")}
          className="flex flex-row justify-between items-center"
        >
          <div className="flex flex-row items-center gap-2">
            <Expand />
            Full
          </div>
          {layout === "full" && <Check />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
