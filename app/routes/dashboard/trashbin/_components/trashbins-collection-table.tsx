import { DeleteTrashbinCollection } from "@/components/action/trashbins";
import { DynamicStatusBadge } from "@/components/shared/dynamic-badge";
import DynamicTableHeaderRow from "@/components/shared/dynamic-table-header-row";
import { TrashbinHoverCard, UserHoverCard } from "@/components/shared/hover";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableRowColumns } from "@/lib/constants";
import type { Status, TrashbinCollection } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";

export default function TrashbinsCollectionTable({
  data,
}: {
  data: TrashbinCollection;
}) {
  const { trashbinsCollectionTable } = tableRowColumns;

  return (
    <TableContainer
      data={data || []}
      sorter={(a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      defaultSortDirection="desc"
      searchFilter={(collection, query) => {
        const q = query.toLowerCase();
        return collection.trashbin.name.toLowerCase().includes(q);
      }}
      dateFilter={(collection, from, to) => {
        const createdAt = new Date(collection.createdAt);
        return (!from || createdAt >= from) && (!to || createdAt <= to);
      }}
    >
      {({ paginatedData }) => (
        <>
          <TableHeader>
            <DynamicTableHeaderRow columns={trashbinsCollectionTable} />
          </TableHeader>
          <TableBody>
            {paginatedData?.map((collection) => (
              <TableRow key={collection.id} className="h-[50px]">
                <TableCell className="capitalize">
                  <TrashbinHoverCard data={collection.trashbin} />
                </TableCell>
                <TableCell className="capitalize">
                  <UserHoverCard data={collection.user} />
                </TableCell>
                <TableCell className="capitalize">
                  <DynamicStatusBadge status={collection.status as Status} />
                </TableCell>
                <TableCell>{formatDate(collection.createdAt)}</TableCell>
                <TableCell>
                  {formatRelativeTime(collection.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-8 mt-[-0.7rem]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <DeleteTrashbinCollection data={collection} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
