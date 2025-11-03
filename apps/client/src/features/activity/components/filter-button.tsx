import { Button } from "@binspire/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { Filter } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

export default function FilterButton() {
  const [filter, setFilter] = useQueryState(
    "filter_activity_by",
    parseAsString.withDefault(""),
  );

  const [selectedFilter, setSelectedFilter] = useState<string | null>(filter);
  const [open, setOpen] = useState(false);

  const applyFilter = () => {
    setFilter(selectedFilter);
    setOpen(false);
  };

  const clearFilter = () => {
    setFilter(null);
    setSelectedFilter(null);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <Filter />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Filter Activity</DrawerTitle>
          <DrawerDescription>
            Customize your activity feed by applying filters to refine the
            displayed results.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={selectedFilter === "collection" ? "default" : "secondary"}
            onClick={() => setSelectedFilter("collection")}
          >
            Collection
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "register" ? "default" : "secondary"}
            onClick={() => setSelectedFilter("register")}
          >
            Register
          </Button>
        </div>

        <DrawerFooter>
          {filter ? (
            <Button onClick={clearFilter} variant="destructive">
              Clear Filter
            </Button>
          ) : (
            <Button onClick={applyFilter}>Apply</Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
