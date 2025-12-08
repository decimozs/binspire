import { Button } from "@binspire/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useMapLayer } from "@/hooks/use-map-layer";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { setLayer } = useMapLayer();

  const [currentTheme, setCurrentTheme] = useState(theme || "dark");

  useEffect(() => {
    setCurrentTheme(theme || "dark");
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    setCurrentTheme(nextTheme);

    if (nextTheme === "light") setLayer("light");
    else setLayer("dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 relative"
          onClick={handleToggleTheme}
        >
          {currentTheme === "light" ? <Sun /> : <Moon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-bold">
          {currentTheme === "light"
            ? "Switch to Dark Theme"
            : "Switch to Light Theme"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
