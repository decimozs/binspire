import { useState } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";

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
  const [open, setOpen] = useState(false); // ✅ Control popover state

  const selectedFont = fontFamilies.find((f) => f.value === selected);

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false); // ✅ Close the popover
  };

  return (
    <div className="p-4 space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={`w-full justify-between ${
              !selected ? "text-muted-foreground" : ""
            }`}
            style={selectedFont?.style}
          >
            {selectedFont ? selectedFont.label : "Select font family"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[250px]">
          <Command>
            <CommandInput placeholder="Search font..." className="h-9" />
            <CommandList>
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {fontFamilies.map((font) => (
                  <CommandItem
                    key={font.value}
                    value={font.label}
                    onSelect={() => handleSelect(font.value)}
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

      {/* Optional preview */}
      {selectedFont && (
        <div
          className="text-center p-4 border rounded-md"
          style={{ fontFamily: selectedFont.value }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
      )}
    </div>
  );
}
