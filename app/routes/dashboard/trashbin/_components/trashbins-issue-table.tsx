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
import type { Status, TrashbinIssue } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useQueryState } from "nuqs";

type ActionType = "update" | "delete" | "view";

export default function TrashbinsIssueTable({ data }: { data: TrashbinIssue }) {
  console.log(data);
  const { trashbinsIssueTable } = tableRowColumns;
  const [, setIssueIdParam] = useQueryState("issue_id");
  const [, setViewTrashbinIssueParam] = useQueryState("view_trashbin_issue");
  const [, setUpdateTrashbinParam] = useQueryState("update_trashbin");
  const [, setDeleteTrashbinParam] = useQueryState("delete_trashbin");
  const handleTableAction = (action: ActionType, id: string) => {
    switch (action) {
      case "view":
        setDeleteTrashbinParam(null);
        setUpdateTrashbinParam(null);
        setIssueIdParam(id);
        setViewTrashbinIssueParam("true");
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
      sorter={(a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      defaultSortDirection="desc"
      searchFilter={(issue, query) => {
        const q = query.toLowerCase();
        return (
          issue.name.toLowerCase().includes(q) ||
          issue.trashbinId.toLowerCase().includes(q) ||
          issue.userId.toLowerCase().includes(q)
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
            <DynamicTableHeaderRow columns={trashbinsIssueTable} />
          </TableHeader>
          <TableBody>
            {paginatedData?.map((issue) => (
              <TableRow key={issue.id} className="h-[50px]">
                <TableCell className="capitalize">{issue.name}</TableCell>
                <TableCell className="capitalize">
                  <TrashbinHoverCard data={issue.trashbin} />
                </TableCell>
                <TableCell className="capitalize">
                  <p className="truncate max-w-sm">{issue.description}</p>
                </TableCell>
                <TableCell className="capitalize">
                  <DynamicStatusBadge status={issue.status as Status} />
                </TableCell>
                <TableCell className="capitalize">
                  <UserHoverCard data={issue.user} />
                </TableCell>
                <TableCell>{formatDate(issue.createdAt)}</TableCell>
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
                        onClick={() => handleTableAction("view", issue.id)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <p>Delete</p>
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
