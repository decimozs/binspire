import { CaseSensitive } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { Button } from "@binspire/ui/components/button";
import { useState } from "react";
import { useFont, type Font } from "@/context/font-provider";
import { fonts } from "../lib/constants";

export default function ChangeFont() {
  const [selectedFont, setSelectedFont] = useState<Font>("manrope");
  const { setFont } = useFont();

  const handleApplyFont = () => {
    setFont(selectedFont);
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <SettingsItem
          label="Change Font"
          description="Select a font style for the app interface."
          icon={CaseSensitive}
        />
      </DrawerTrigger>

      <DrawerContent className="font-bold">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">Font</DrawerTitle>
          <DrawerDescription>
            Select a font you prefer for the app.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Select
            value={selectedFont}
            onValueChange={(value: Font) => setSelectedFont(value)}
          >
            <SelectTrigger className="w-full min-h-12">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DrawerFooter>
          <Button onClick={handleApplyFont}>Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
