import { Blend } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryState } from "nuqs";
import { useFilteringStore } from "@/store/filtering.store";
import { trashbinsFilterOptions } from "@/lib/constants";

export default function FilterTrashbins() {
  const { setFiltering } = useFilteringStore();

  const paramSetters: Record<string, (val: string) => void> = {
    wl: useQueryState("waste_status", { history: "replace" })[1],
    ws: useQueryState("weight_status", { history: "replace" })[1],
    bs: useQueryState("battry_status", { history: "replace" })[1],
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <Blend />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-2 w-[13rem]"
        align="start"
        side="right"
      >
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {trashbinsFilterOptions.map((group) => (
          <DropdownMenuGroup key={group.key}>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{group.label}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-[11rem]">
                  {group.options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        paramSetters[group.key]?.(option.value);
                        setFiltering(true);
                      }}
                    >
                      {option.label}
                      <DropdownMenuShortcut>
                        <span
                          className={`relative inline-flex size-3 rounded-full ${option.color}`}
                        />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
