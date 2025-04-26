import { Table } from "@/components/ui/table";
import SearchBar from "./search-bar";
import { CalendarDatePicker } from "../ui/date-picker";
import { useQueryState } from "nuqs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "./pagination";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";

type SortDirection = "asc" | "desc";

type TableContainerProps<T> = {
  data: T[];
  searchFilter?: (item: T, search: string) => boolean;
  dateFilter?: (item: T, from: Date | null, to: Date | null) => boolean;
  sorter?: (a: T, b: T) => number;
  defaultSortDirection?: SortDirection;
  children: (props: { paginatedData: T[] }) => ReactNode;
};

export function TableContainer<T>({
  data,
  searchFilter,
  dateFilter,
  sorter,
  defaultSortDirection = "asc",
  children,
}: TableContainerProps<T>) {
  const [search, setSearch] = useQueryState("search");
  const [page, setPage] = useQueryState("page", {
    history: "push",
    defaultValue: "1",
  });
  const [limit] = useQueryState("limit", {
    history: "push",
    defaultValue: "14",
  });

  const [from, setFrom] = useQueryState("from", {
    parse: (value) => (value ? new Date(value) : null),
    serialize: (value) => value?.toISOString() ?? "",
  });
  const [to, setTo] = useQueryState("to", {
    parse: (value) => (value ? new Date(value) : null),
    serialize: (value) => value?.toISOString() ?? "",
  });

  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection);

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const selectedDateRange = {
    from: from || new Date(new Date().getFullYear(), 0, 1),
    to: to || new Date(),
  };

  let filtered = data.filter((item) => {
    const matchesSearch = searchFilter
      ? searchFilter(item, search || "")
      : true;
    const matchesDate = dateFilter ? dateFilter(item, from, to) : true;
    return matchesSearch && matchesDate;
  });

  if (sorter) {
    filtered = [...filtered].sort((a, b) =>
      sortDirection === "asc" ? sorter(a, b) : sorter(b, a),
    );
  }

  const pageNumber = parseInt(page || "1", 10);
  const pageSize = parseInt(limit || "15", 10);

  const { paginatedData, safePage, totalPages, totalItems } = usePagination(
    filtered,
    pageNumber,
    pageSize,
  );

  const hasFilters = !!search || from !== null || to !== null;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-row items-center justify-between gap-2">
        <div className="flex gap-2">
          <SearchBar
            value={search || ""}
            onChange={(val) => {
              setSearch(val);
              setPage("1");
            }}
            placeholder="What are you looking for?"
          />
          {hasFilters && (
            <Button
              onClick={() => {
                setSearch(null);
                setFrom(null);
                setTo(null);
                setPage("1");
              }}
            >
              <X size={15} />
              Reset
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleSort}>
            Sort: {sortDirection === "asc" ? "Asc" : "Desc"}
            {sortDirection === "asc" && <ChevronUp size={15} />}
            {sortDirection === "desc" && <ChevronDown size={15} />}
          </Button>
          <CalendarDatePicker
            date={selectedDateRange}
            onDateSelect={(date) => {
              setFrom(date.from);
              setTo(date.to);
              setPage("1");
            }}
            variant="outline"
          />
        </div>
      </div>
      <Table className={paginatedData.length >= 15 ? "grow" : ""}>
        {children({ paginatedData })}
      </Table>
      <PaginationControls
        currentPage={safePage}
        totalPages={totalPages}
        totalResults={totalItems}
        onPageChange={(newPage) => setPage(String(newPage))}
        className={paginatedData.length >= 15 ? "" : "mt-auto"}
      />
    </div>
  );
}
