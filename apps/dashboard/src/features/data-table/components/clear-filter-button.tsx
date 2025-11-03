import { Button } from "@binspire/ui/components/button";
import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";

interface ClearFilterButtonProps<T> {
  table: Table<T>;
}

export default function ClearFilterButton<T>({
  table,
}: ClearFilterButtonProps<T>) {
  const [, setFilter] = useQueryState("filter");

  const clearAllFilters = () => {
    table.getAllColumns().forEach((column) => column.setFilterValue(undefined));

    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url.toString());
    table.getAllColumns().forEach((column) => column.setFilterValue(undefined));
    setFilter(null);
  };

  if (table.getState().columnFilters.length === 0) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      className="h-9"
      onClick={clearAllFilters}
    >
      <X />
    </Button>
  );
}
