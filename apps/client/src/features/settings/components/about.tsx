import { Info } from "lucide-react";
import SettingsItem from "./settings-item";
import lastUpdated from "@/last-updated.txt?raw";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";

export default function About() {
  return (
    <Drawer>
      <DrawerTrigger>
        <SettingsItem
          label="About"
          description="Learn more about this application."
          icon={Info}
        />
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">About</DrawerTitle>
          <DrawerDescription>
            View system details including version, health status, updates,
            developer info, and license.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-[120px_1fr] md:w-md">
          <div className="flex flex-col gap-2">
            <p>Version</p>
            <p>System Health</p>
            <p>Last Update</p>
            <p>Developed By</p>
            <p>Contact</p>
            <p>License</p>
          </div>
          <div className="text-right text-muted-foreground flex flex-col gap-2">
            <p>2.0.0</p>
            <div className="flex flex-row items-center gap-2 justify-end">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
              </span>
              <p>Good</p>
            </div>
            <p>{format(new Date(lastUpdated.trim()), "MMMM d, yyyy")}</p>
            <p>Binspire</p>
            <p>contact.binspire@gmail.com</p>
            <p>MIT License</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
