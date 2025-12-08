import { Button } from "@binspire/ui/components/button";
import { Calendar, type DateRange } from "@binspire/ui/components/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import type { Column, Table } from "@tanstack/react-table";
import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { Calendar1 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

interface RangeCalendarProps<T> {
  column?: Column<T>;
  table: Table<T>;
}

export default function RangeCalendar<T>({ column }: RangeCalendarProps<T>) {
  const today = useMemo(() => new Date(), []);
  const [open, setOpen] = useState(false);

  const filterValue = column?.getFilterValue() as DateRange | undefined;

  const presets = useMemo(
    () => [
      {
        label: "Today",
        range: { from: startOfDay(today), to: endOfDay(today) },
      },
      {
        label: "Yesterday",
        range: { from: subDays(today, 1), to: subDays(today, 1) },
      },
      { label: "Last 7 days", range: { from: subDays(today, 6), to: today } },
      { label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
      {
        label: "Month to date",
        range: { from: startOfMonth(today), to: today },
      },
      {
        label: "Last month",
        range: {
          from: startOfMonth(subMonths(today, 1)),
          to: endOfMonth(subMonths(today, 1)),
        },
      },
      { label: "Year to date", range: { from: startOfYear(today), to: today } },
      {
        label: "Last year",
        range: {
          from: startOfYear(subYears(today, 1)),
          to: endOfYear(subYears(today, 1)),
        },
      },
    ],
    [today],
  );

  const applyFilter = useCallback(
    (range: DateRange | undefined) => {
      column?.setFilterValue(range);
    },
    [column],
  );

  const clearFilter = useCallback(() => {
    column?.setFilterValue(undefined);
    setOpen(false);
  }, [column]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar1 />
          Date Picker
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="rounded-md">
          <div className="flex max-sm:flex-col">
            <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
              <div className="h-full sm:border-e">
                <div className="flex flex-col px-2">
                  {presets.map((preset) => (
                    <PresetButton
                      key={preset.label}
                      label={preset.label}
                      onClick={() => applyFilter(preset.range)}
                    />
                  ))}
                  {filterValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive"
                      onClick={clearFilter}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Calendar
              mode="range"
              selected={filterValue}
              onSelect={applyFilter}
              className="p-2"
              disabled={{ after: today }}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PresetButton = React.memo(function PresetButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={onClick}
    >
      {label}
    </Button>
  );
});
