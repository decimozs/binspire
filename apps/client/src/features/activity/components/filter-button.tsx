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
          <DrawerTitle className="text-4xl font-bold">
            Filter Activity
          </DrawerTitle>
          <DrawerDescription>
            Customize your activity feed by applying filters to refine the
            displayed results.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 grid grid-cols-2 gap-2">
          <Button
            size="lg"
            className="font-bold"
            variant={selectedFilter === "collection" ? "default" : "secondary"}
            onClick={() => setSelectedFilter("collection")}
          >
            Collection
          </Button>
          <Button
            size="lg"
            className="font-bold"
            variant={selectedFilter === "register" ? "default" : "secondary"}
            onClick={() => setSelectedFilter("register")}
          >
            Register
          </Button>
        </div>

        <DrawerFooter>
          {filter ? (
            <Button
              onClick={clearFilter}
              variant="destructive"
              className="w-full text-lg font-bold"
            >
              Clear Filter
            </Button>
          ) : (
            <Button onClick={applyFilter} className="w-full text-lg font-bold">
              Apply
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
