import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type Table as ReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@binspire/ui/components/table";
import { Input } from "@binspire/ui/components/input";
import RangeCalendar from "./components/range-calendar";
import {
  actionsColumn,
  createdAtColumn,
  selectColumn,
  updatedAtColumn,
} from "./lib/base-column";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import ColumnsButton from "./components/columns-button";
import ExportButton from "./components/export-button";
import { parseAsInteger, parseAsJson, useQueryState } from "nuqs";
import TablePagination from "./components/table-pagination";
import {
  FacetedFilterButton,
  FilterSchema,
} from "./components/faceted-filter-button";
import ClearFilterButton from "./components/clear-filter-button";
import { SortSchema } from "./components/sorting-button";
import { debounce } from "lodash";
import CreateIssueButton from "../issues/components/create-issue-button";
import LeaderboardsButton from "../leaderboards/components/leaderboards-button";
import { useLocation } from "@tanstack/react-router";
import InviteUserButton from "./components/invite-user-button";
import CreateGreenHearts from "../green-hearts/components/create-green-hearts";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderActions?: (row: TData) => ReactNode;
  facetedFilterColumns?: string[];
  recentChangesMode?: boolean;
  renderBatchActions?: (data: TData[], table: ReactTable<TData>) => ReactNode;
}

export default function DataTable<
  TData extends { createdAt: string | Date },
  TValue = unknown,
>({
  columns,
  data,
  renderActions,
  facetedFilterColumns,
  recentChangesMode = false,
  renderBatchActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useQueryState(
    "sort",
    parseAsJson(SortSchema).withDefault([]),
  );
  const [columnFilters, setColumnFilters] = useQueryState(
    "filter",
    parseAsJson(FilterSchema).withDefault([]),
  );
  const [globalFilter, setGlobalFilter] = useQueryState("search", {
    defaultValue: "",
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pageIndex] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));
  const [searchInput, setSearchInput] = useState(globalFilter);
  const location = useLocation();

  const tableColumns = [
    selectColumn<TData>(),
    ...columns,
    createdAtColumn<TData>("Created At"),
    updatedAtColumn<TData>("Last Updated"),
    actionsColumn<TData>(renderActions),
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: sorting ?? [],
      columnFilters,
      globalFilter,
      pagination: { pageIndex, pageSize },
      rowSelection,
      columnVisibility: {
        trashbinId: false,
      },
    },
  });

  const isTotalSizeEnough = data.length > 0;

  const debouncedSetGlobalFilter = useMemo(
    () => debounce((val: string) => setGlobalFilter(val), 300),
    [setGlobalFilter],
  );

  useEffect(() => {
    setSearchInput(globalFilter);
  }, [globalFilter]);

  useEffect(() => {
    debouncedSetGlobalFilter(searchInput);
    return () => debouncedSetGlobalFilter.cancel();
  }, [searchInput, debouncedSetGlobalFilter]);

  useEffect(() => {
    if (recentChangesMode) {
      setSorting([{ id: "updatedAt", desc: true }]);
    }
  }, [recentChangesMode, setSorting]);

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 items-center justify-between w-full">
        <div className="flex flex-row items-center gap-3">
          {isTotalSizeEnough && !recentChangesMode && (
            <Input
              placeholder="What are you looking for?"
              className="h-9 max-w-[300px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          )}
          <LeaderboardsButton />
          <div className="flex flex-row items-center gap-2">
            {isTotalSizeEnough &&
              !recentChangesMode &&
              facetedFilterColumns?.map((colId) => {
                const column = table.getColumn(colId);
                if (!column) return null;

                return (
                  <FacetedFilterButton
                    key={colId}
                    column={column}
                    title={colId}
                  />
                );
              })}
          </div>
          <ClearFilterButton table={table} />
        </div>
        <div className="flex flex-row items-center gap-2 justify-end">
          {isTotalSizeEnough && !recentChangesMode && (
            <RangeCalendar
              column={table.getColumn("createdAt")}
              table={table}
            />
          )}
          {isTotalSizeEnough && !recentChangesMode && (
            <ExportButton table={table} />
          )}
          {isTotalSizeEnough && !recentChangesMode && (
            <ColumnsButton table={table} />
          )}
          {location.pathname === "/users" ||
            (location.pathname === "/invitations" && <InviteUserButton />)}
          <CreateIssueButton />
          {location.pathname === "/green-hearts" && <CreateGreenHearts />}
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  <div className="flex h-full items-center justify-center">
                    No results.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isTotalSizeEnough && !recentChangesMode && (
        <TablePagination table={table} dataLength={data.length} />
      )}
      {selectedData.length > 0 && renderBatchActions?.(selectedData, table)}
    </div>
  );
}
