import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CaseSensitive,
  Palette,
  Text,
  StretchVertical,
  Contrast,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch"; // adjust the import to your Switch component
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import FontFamilySettings from "@/components/settings/font-family-settings";
import LayoutDensitySettings from "@/components/settings/layout-density-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";

export default function AppearanceSettingRoute() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-3xl font-semibold">Appearance</h1>

      <SettingRow
        icon={<Palette />}
        title="Theme"
        description="Switch between light, dark, or system themes to personalize your viewing experience."
        actionLabel="Change"
      />

      <SettingRow
        icon={<CaseSensitive />}
        title="Font Family"
        description="Choose your preferred font style to enhance readability."
        actionLabel="Change"
      />

      <SettingRow
        icon={<Text />}
        title="Font Size"
        description="Adjust the font size across the interface to suit your comfort."
        actionLabel="Adjust"
      />

      <SettingRow
        icon={<StretchVertical />}
        title="Layout Density"
        description="Switch between comfortable and compact layouts depending on your screen size and preferences."
        actionLabel="Change"
      />

      <SettingRow
        icon={<Contrast />}
        title="High Contrast Mode"
        description="Enable high contrast colors to improve visibility and accessibility."
        actionLabel="Toggle"
      />
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}) {
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(16); // default font size

  // Clamp function to keep font size in bounds
  const clampFontSize = (size: number) => Math.min(30, Math.max(10, size));

  // If it's High Contrast Mode, render Switch instead of Dialog + Button
  if (title === "High Contrast Mode") {
    return (
      <div className="flex flex-row gap-4 items-center">
        <div className="border-input border-[1px] border-dashed rounded-md p-4">
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="ml-4">
          <Switch
            checked={highContrastEnabled}
            onCheckedChange={setHighContrastEnabled}
            aria-label="Toggle High Contrast Mode"
          />
        </div>
      </div>
    );
  }

  if (title === "Font Size") {
    return (
      <div className="flex flex-row gap-4 items-center">
        <div className="border-input border-[1px] border-dashed rounded-md p-4">
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setFontSize((size) => clampFontSize(size - 1))}
            aria-label="Decrease font size"
            className="w-[25px] h-[25px]"
          >
            <Minus />
          </Button>
          <span className="w-10 text-sm text-center">{fontSize}px</span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setFontSize((size) => clampFontSize(size + 1))}
            aria-label="Increase font size"
            className="w-[25px] h-[25px]"
          >
            <Plus />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-input border-[1px] border-dashed rounded-md p-4">
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="ml-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>{actionLabel}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <SettingDialogContent setting={title} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">Apply Changes</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function SettingDialogContent({ setting }: { setting: string }) {
  switch (setting) {
    case "Theme":
      return <ThemeSettings />;

    case "Font Family":
      return <FontFamilySettings />;

    case "Layout Density":
      return <LayoutDensitySettings />;

    default:
      return <p>No settings available.</p>;
  }
}
