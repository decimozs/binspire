import { DeleteTrashbin } from "@/components/action/trashbins";
import { DynamicTrashbinStatusBadge } from "@/components/shared/dynamic-badge";
import DynamicTableHeaderRow from "@/components/shared/dynamic-table-header-row";
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
import type { Trashbin } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useQueryState } from "nuqs";

type ActionType = "update" | "delete" | "view";

export default function TrashbinsTable({ data }: { data: Trashbin[] }) {
  const { trashbinsManagementTable } = tableRowColumns;
  const [, setTrashbinIdParam] = useQueryState("trashbin_id");
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");
  const [, setUpdateTrashbinParam] = useQueryState("update_trashbin");
  const [, setDeleteTrashbinParam] = useQueryState("delete_trashbin");
  const handleTableAction = (action: ActionType, id: string) => {
    setTrashbinIdParam(id);
    switch (action) {
      case "view":
        setDeleteTrashbinParam(null);
        setUpdateTrashbinParam(null);
        setTrashbinIdParam(id);
        setViewTrashbinParam("true");
        break;
      case "delete":
        setUpdateTrashbinParam(null);
        setDeleteTrashbinParam("true");
        break;
      default:
        console.warn(`Unhandled action type: ${action}`);
    }
  };

  return (
    <TableContainer
      data={data || []}
      sorter={(a, b) => a.name.localeCompare(b.name)}
      defaultSortDirection="asc"
      searchFilter={(trashbin, query) => {
        const q = query.toLowerCase();
        return (
          trashbin.name.toLowerCase().includes(q) ||
          trashbin.batteryStatus.toLowerCase().includes(q) ||
          trashbin.wasteStatus.toLowerCase().includes(q) ||
          trashbin.weightStatus.toLowerCase().includes(q) ||
          (trashbin.isActive ? "online" : "offline").includes(q)
        );
      }}
      dateFilter={(trashbin, from, to) => {
        const createdAt = new Date(trashbin.createdAt);
        return (!from || createdAt >= from) && (!to || createdAt <= to);
      }}
    >
      {({ paginatedData }) => (
        <>
          <TableHeader>
            <DynamicTableHeaderRow columns={trashbinsManagementTable} />
          </TableHeader>
          <TableBody>
            {paginatedData?.map((trashbin) => (
              <TableRow key={trashbin.id} className="h-[50px]">
                <TableCell>{trashbin.name}</TableCell>
                <TableCell className="capitalize">
                  <DynamicTrashbinStatusBadge
                    status={trashbin.wasteStatus}
                    level={trashbin.wasteLevel}
                  />
                </TableCell>
                <TableCell className="capitalize">
                  <DynamicTrashbinStatusBadge
                    status={trashbin.weightStatus}
                    level={trashbin.weightLevel}
                  />
                </TableCell>
                <TableCell className="capitalize">
                  <DynamicTrashbinStatusBadge
                    status={trashbin.batteryStatus}
                    level={trashbin.batteryLevel}
                  />
                </TableCell>
                <TableCell>{formatDate(trashbin.createdAt)}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() => handleTableAction("view", trashbin.id)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteTrashbin data={trashbin} />
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
