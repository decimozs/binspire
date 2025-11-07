import { SunMoon } from "lucide-react";
import SettingsItem from "./settings-item";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import {
  RadioGroup,
  RadioGroupItem,
} from "@binspire/ui/components/radio-group";
import { Button } from "@binspire/ui/components/button";
import { useTheme, type Theme } from "@/context/theme-provider";
import { useState } from "react";

export default function ChangeTheme() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("system");
  const { setTheme } = useTheme();

  const handleApplyTheme = () => {
    setTheme(selectedTheme);
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <SettingsItem
          label="Change Theme"
          description="Adjust the app’s color scheme for your preference."
          icon={SunMoon}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">Theme</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <RadioGroup
            className="grid grid-cols-2 gap-4"
            value={selectedTheme}
            onValueChange={(val: Theme) => {
              setSelectedTheme(val);
            }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm">Light</p>
              <label
                htmlFor="theme-light"
                className={`cursor-pointer border-[2px] border-muted-foreground rounded-md ${
                  selectedTheme === "light" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem
                  value="light"
                  id="theme-light"
                  className="sr-only"
                />
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2 border-[1px] border-muted-foreground rounded-md">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Dark</p>
              <label
                htmlFor="theme-dark"
                className={`cursor-pointer border-[2px] border-muted-foreground rounded-md ${
                  selectedTheme === "dark" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem
                  value="dark"
                  id="theme-dark"
                  className="sr-only"
                />
                <div className="space-y-2 rounded-sm bg-slate-950 p-2 border-[1px] border-muted-foreground rounded-md">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </label>
            </div>
          </RadioGroup>
        </div>
        <DrawerFooter>
          <Button onClick={handleApplyTheme}>Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
