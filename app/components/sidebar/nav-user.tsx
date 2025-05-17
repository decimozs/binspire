import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  History,
  LogOut,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Form, useFetcher, useNavigate } from "react-router";
import { Button } from "../ui/button";
import type { User, Notification } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Sheet } from "@/components/ui/sheet";
import { useState } from "react";
import { NotificationContent } from "../shared/sheet-content";
import { useQueryState } from "nuqs";
import { useNotificationStore } from "@/store/notifications.store";

export function NavUser({ user, userId }: { user: User; userId: string }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [notificationSheet, setNotificationSheet] = useQueryState(
    "notification",
    {
      history: "replace",
      parse: (val) => val === "open",
    },
  );
  const fallbackInitials = user.name
    .split(" ")
    .map((point) => point[0])
    .join("");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image as string} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {fallbackInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image as string} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {fallbackInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="capitalize flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <UsersRound />
                  {user.role}
                </div>
                <div>
                  <Badge>
                    {user.permission
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </Badge>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/dashboard/user/management/profile/${userId}`)
                }
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History />
                History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNotificationSheet(true)}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Form method="POST" action="/dashboard?index">
                <Button type="submit" variant="ghost" className="px-0">
                  <LogOut />
                  Log out
                </Button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Sheet
        open={notificationSheet as boolean}
        onOpenChange={(open) => setNotificationSheet(open)}
      >
        <NotificationContent />
      </Sheet>
    </SidebarMenu>
  );
}
