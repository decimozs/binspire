import { MonitorCog, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../provider/theme-provider";

export function ThemeSettings() {
  const { setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        className="text-muted-foreground h-[150px] border-dashed flex flex-col items-center"
        variant="outline"
        onClick={() => setTheme("light")}
      >
        <Sun />
        Light
      </Button>

      <Button
        className="text-muted-foreground h-[150px] border-dashed flex flex-col items-center"
        variant="outline"
        onClick={() => setTheme("dark")}
      >
        <Moon />
        Dark
      </Button>

      <Button
        className="text-muted-foreground h-[150px] border-dashed flex flex-col items-center"
        variant="outline"
        onClick={() => setTheme("system")}
      >
        <MonitorCog />
        System Settings
      </Button>
    </div>
  );
}
