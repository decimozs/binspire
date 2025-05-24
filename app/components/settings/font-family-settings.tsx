import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

const fontFamilies = [
  {
    label: "System Default",
    value: "system-ui",
    style: { fontFamily: "system-ui" },
  },
  {
    label: "Arial",
    value: "Arial, sans-serif",
    style: { fontFamily: "Arial, sans-serif" },
  },
  {
    label: "Georgia",
    value: "Georgia, serif",
    style: { fontFamily: "Georgia, serif" },
  },
  {
    label: "Courier New",
    value: "'Courier New', monospace",
    style: { fontFamily: "'Courier New', monospace" },
  },
  {
    label: "Tahoma",
    value: "Tahoma, sans-serif",
    style: { fontFamily: "Tahoma, sans-serif" },
  },
  {
    label: "Times New Roman",
    value: "'Times New Roman', serif",
    style: { fontFamily: "'Times New Roman', serif" },
  },
  {
    label: "Verdana",
    value: "Verdana, sans-serif",
    style: { fontFamily: "Verdana, sans-serif" },
  },
] as const;

export default function FontFamilySettings() {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const selectedFont = fontFamilies.find((f) => f.value === selected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between ${
            !selected ? "text-muted-foreground" : ""
          }`}
          style={selectedFont ? selectedFont.style : {}}
        >
          {selectedFont ? selectedFont.label : "Select font family"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search font..." className="h-9" />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup>
              {fontFamilies.map((font) => (
                <CommandItem
                  key={font.value}
                  value={font.label}
                  onSelect={() => setSelected(font.value)}
                  style={font.style}
                >
                  {font.label}
                  <Check
                    className={`ml-auto ${
                      font.value === selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
