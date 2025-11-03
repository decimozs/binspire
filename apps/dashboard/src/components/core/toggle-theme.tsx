import { MonitorIcon, Moon, MoonIcon, Sun, SunIcon } from "lucide-react";
import { Button } from "@binspire/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { useMapLayer } from "@/hooks/use-map-layer";

export default function ThemeToggle() {
  const { setTheme } = useTheme();
  const { setLayer } = useMapLayer();

  const handleSetTheme = (theme: "light" | "dark" | "system") => {
    setTheme(theme);

    if (theme === "light") setLayer("light");
    else if (theme === "dark") setLayer("dark");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="mt-2">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSetTheme("light")}>
          <SunIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("dark")}>
          <MoonIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("system")}>
          <MonitorIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
