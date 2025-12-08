import { formatLabel, toTitleCase } from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import { Checkbox } from "@binspire/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import type { Column } from "@tanstack/react-table";
import { Blend, X } from "lucide-react";
import { parseAsJson, useQueryState } from "nuqs";
import React, { useCallback, useMemo } from "react";
import z from "zod";

interface FacetedFilterProps<T> {
  column: Column<T>;
  title: string;
}

export const FilterSchema = z.array(
  z.object({
    id: z.string(),
    value: z.any(),
  }),
);

const CheckboxItem = React.memo(function CheckboxItem({
  value,
  count,
  checked,
  onToggle,
}: {
  value: string;
  count: number;
  checked: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={(e: Event) => e.preventDefault()}
      onClick={() => onToggle(value)}
      className="flex flex-row items-center gap-3 p-2"
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle(value)}
        className="border-primary"
      />
      <div className="grid grid-cols-2 w-full">
        <p className="text-sm capitalize">{formatLabel(value)}</p>
        <div className="ml-auto w-[25px] green-badge flex items-center justify-center">
          <p className="rounded-sm text-xs">{count}</p>
        </div>
      </div>
    </DropdownMenuItem>
  );
});

export function FacetedFilterButton<T>({
  column,
  title,
}: FacetedFilterProps<T>) {
  const [filters, setFilters] = useQueryState(
    "filter",
    parseAsJson(FilterSchema).withDefault([]),
  );

  const facetedValues = useMemo(
    () =>
      Array.from(column?.getFacetedUniqueValues()?.entries() ?? []) as [
        string,
        number,
      ][],
    [column],
  );

  const handleSelect = useCallback(
    (value: string) => {
      const existing = filters.find((f) => f.id === column.id);
      let updatedFilters;

      if (existing) {
        const currentValues = Array.isArray(existing.value)
          ? existing.value
          : [existing.value];

        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];

        updatedFilters =
          newValues.length === 0
            ? filters.filter((f) => f.id !== column.id)
            : filters.map((f) =>
                f.id === column.id ? { ...f, value: newValues } : f,
              );
      } else {
        updatedFilters = [...filters, { id: column.id, value: [value] }];
      }

      setFilters(updatedFilters.length ? updatedFilters : null);
      column.setFilterValue(
        updatedFilters.find((f) => f.id === column.id)?.value ?? undefined,
      );
    },
    [filters, column, setFilters],
  );

  const clearFilters = useCallback(() => {
    const updatedFilters = filters.filter((f) => f.id !== column.id);
    setFilters(updatedFilters.length ? updatedFilters : null);
    column.setFilterValue(undefined);
  }, [filters, column, setFilters]);

  const hasFilters = filters.some((f) => f.id === column.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-dashed" size="sm">
          <Blend className="mr-2 h-4 w-4" />
          {toTitleCase(title)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {facetedValues.map(([value, count]) => (
          <CheckboxItem
            key={value}
            value={value}
            count={count}
            checked={filters.some(
              (f) =>
                f.id === column.id &&
                (Array.isArray(f.value)
                  ? f.value.includes(value)
                  : f.value === value),
            )}
            onToggle={handleSelect}
          />
        ))}

        {hasFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={clearFilters}
              className="flex items-center gap-2"
              variant="destructive"
            >
              <X className="h-4 w-4" />
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
