import * as React from "react";
import { ArrowUpRight, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Trashbin, TrashbinStatus } from "@/lib/types";
import { useMap } from "react-map-gl/maplibre";
import { useQueryState } from "nuqs";
import { trashbinStatusColorMap } from "@/lib/constants";

export function SearchTrashbin({ data }: { data: Trashbin[] }) {
  const [open, setOpen] = React.useState(false);
  const { current: map } = useMap();
  const [, setTrashbinIdParams] = useQueryState("t", {
    history: "replace",
  });

  const handleNavigateTrashbin = (
    id: string,
    longitude: string,
    latitude: string,
  ) => {
    const offsetLng = 0.0002;
    map?.flyTo({
      center: [Number(longitude) + offsetLng, Number(latitude)],
      zoom: 20,
      essential: true,
      duration: 2000,
    });
    setTrashbinIdParams(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon">
          <Search />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 ml-2" side="right" align="start">
        <Command>
          <CommandInput placeholder="Looking for trashbins?" className="h-9" />
          <CommandList>
            <CommandEmpty>No trashbins found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  className="cursor-pointer"
                  onSelect={() => {
                    handleNavigateTrashbin(
                      item.id,
                      item.longitude,
                      item.latitude,
                    );
                  }}
                >
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center gap-4">
                      <TrendingUp
                        style={{
                          color:
                            trashbinStatusColorMap[
                              item.wasteStatus as TrashbinStatus
                            ],
                        }}
                      />

                      {item.name}
                    </div>
                    <ArrowUpRight />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
