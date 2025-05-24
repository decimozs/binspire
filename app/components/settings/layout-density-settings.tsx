import {
  Command,
  CommandEmpty,
  CommandGroup,
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

const layoutOptions = [
  {
    label: "Comfortable",
    value: "comfortable",
    description: "More spacing, easier on the eyes",
  },
  {
    label: "Compact",
    value: "compact",
    description: "Less spacing, fits more content",
  },
  {
    label: "Cozy",
    value: "cozy",
    description: "Balanced spacing between comfortable and compact",
  },
] as const;

export default function LayoutDensitySettings() {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const selectedLayout = layoutOptions.find((o) => o.value === selected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between ${
            !selected ? "text-muted-foreground" : ""
          }`}
        >
          {selectedLayout ? selectedLayout.label : "Select layout density"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No layout found.</CommandEmpty>
            <CommandGroup>
              {layoutOptions.map((layout) => (
                <CommandItem
                  key={layout.value}
                  value={layout.label}
                  onSelect={() => setSelected(layout.value)}
                  className="flex flex-col"
                >
                  <span>{layout.label}</span>
                  <small className="text-xs text-muted-foreground">
                    {layout.description}
                  </small>
                  <Check
                    className={`ml-auto ${
                      layout.value === selected ? "opacity-100" : "opacity-0"
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
