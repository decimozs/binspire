import {
  DynamicActionBadge,
  DynamicActionStatusBadge,
  DynamicActiveBadge,
  DynamicPermissionBadge,
} from "@/components/shared/dynamic-badge";
import DynamicTableHeaderRow from "@/components/shared/dynamic-table-header-row";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableRowColumns } from "@/lib/constants";
import type { UserActivities } from "@/lib/types";
import { fallbackInitials, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Calendar,
  Ellipsis,
  Mail,
  UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

export default function ActivityLogsTable({
  activities,
}: {
  activities?: UserActivities;
}) {
  const { data } = useQuery({
    queryKey: ["users-activities"],
    queryFn: () => activities,
  });
  const { activityLogsTable } = tableRowColumns;
  return (
    <TableContainer
      data={data as UserActivities}
      sorter={(a, b) => a.title.localeCompare(b.title)}
      searchFilter={(data, query) => {
        const q = query.toLowerCase();
        return (
          data.title.toLowerCase().includes(q) ||
          data.action.toLowerCase().includes(q) ||
          data.description.toLowerCase().includes(q) ||
          data.user.name.toLowerCase().includes(q) ||
          data.user.role.toLowerCase().includes(q) ||
          data.status.toLowerCase().includes(q)
        );
      }}
      dateFilter={(user, from, to) => {
        const createdAt = new Date(user.createdAt);
        return (!from || createdAt >= from) && (!to || createdAt <= to);
      }}
    >
      {({ paginatedData }) => (
        <>
          <TableHeader>
            <DynamicTableHeaderRow columns={activityLogsTable} />
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <span className="flex flex-row items-center gap-2">
                      <DynamicActionBadge action={item.action} />
                      {item.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DynamicActionStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger>
                        <span className="flex flex-row items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={item.user.image as string}
                              alt={item.user.name}
                            />
                            <AvatarFallback>
                              {fallbackInitials(item.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          {item.user.name}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="flex flex-col gap-2">
                          <DynamicActiveBadge isOnline={item.user.isOnline} />
                          <div className="flex flex-row items-center justify-between">
                            <p>{item.user.name}</p>
                            <Badge className="capitalize">
                              {item.user.permission}
                            </Badge>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground capitalize">
                              <UsersRound size={15} className="mt-[0.1rem]" />
                              {item.user.role}
                            </p>
                            <p className="text-sm flex flex-row gap-2 text-muted-foreground w-fit wrap-anywhere">
                              <Mail size={15} className="mt-[0.2rem]" />
                              {item.user.email}
                            </p>
                            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
                              <Calendar size={15} className="mt-[0.1rem]" />
                              Joined on{" "}
                              {formatDate(item.user.createdAt as Date)}
                            </p>
                          </div>
                          <Link
                            to={`/dashboard/user/management/profile/${item.user.id}`}
                            prefetch="intent"
                          >
                            <Button variant="secondary" className="w-full">
                              <ArrowUpRight size={15} className="mt-[0.1rem]" />
                              Profile
                            </Button>
                          </Link>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
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
                        <DropdownMenuItem>Review</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 ">
                    No activities found
                  </TableCell>
                </TableRow>
              </TableRow>
            )}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
