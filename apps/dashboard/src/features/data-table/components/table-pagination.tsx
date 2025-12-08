import { Button } from "@binspire/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

interface TablePaginationProps<T> {
  table: Table<T>;
  dataLength: number;
}

function TablePaginationInner<T>({
  table,
  dataLength,
}: TablePaginationProps<T>) {
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10),
  );

  const pageSizes = useMemo(() => {
    return [5, 10, 20].filter((s) => s < dataLength);
  }, [dataLength]);

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  const goFirst = useCallback(() => setPageIndex(0), [setPageIndex]);
  const goPrev = useCallback(
    () => setPageIndex(Math.max(pageIndex - 1, 0)),
    [pageIndex, setPageIndex],
  );
  const goNext = useCallback(
    () => setPageIndex(Math.min(pageIndex + 1, table.getPageCount() - 1)),
    [pageIndex, table, setPageIndex],
  );
  const goLast = useCallback(
    () => setPageIndex(table.getPageCount() - 1),
    [table, setPageIndex],
  );

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 text-sm text-muted-foreground">
        <p>
          <span className={selectedCount === 0 ? "" : "text-primary font-bold"}>
            {" "}
            {selectedCount}
          </span>{" "}
          of {totalCount} row(s) selected.
        </p>
      </div>

      <div className="flex flex-row gap-8 items-center">
        {dataLength > 10 && (
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              {[...pageSizes, dataLength].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="text-sm text-muted-foreground">
          Page {pageIndex + 1} of {table.getPageCount()}
        </div>

        {dataLength > 10 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goFirst}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goPrev}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goNext}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goLast}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TablePaginationInner;
