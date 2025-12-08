import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@binspire/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
import { useLocation } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import type * as React from "react";
import { GeneralMenu } from "./general-menu";
import OrgHeader from "./org-header";
import { OtherMenu } from "./other-menu";
import { SidebarUser } from "./sidebar-user";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [, setCreateIssue] = useQueryState(
    "is_creating_issue",
    parseAsBoolean.withDefault(false),
  );

  const handleCreateIssue = () => {
    setCreateIssue(true);
  };

  return (
    <Sidebar
      collapsible={location.pathname === "/map" ? "offcanvas" : "icon"}
      {...props}
      variant={location.pathname === "/map" ? "floating" : "inset"}
      className="bg-transparent"
    >
      <SidebarHeader>
        <OrgHeader />
      </SidebarHeader>
      <SidebarContent>
        <GeneralMenu />
        <OtherMenu />
        <SidebarGroup>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={handleCreateIssue}
                  className="cursor-pointer"
                >
                  <Ticket />
                  <span>Report Issue</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-bold">Report Issue</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
