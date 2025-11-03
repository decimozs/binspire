import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@binspire/ui/components/sidebar";
import { GeneralMenu } from "./general-menu";
import { OtherMenu } from "./other-menu";
import { SidebarUser } from "./sidebar-user";
import { useLocation } from "@tanstack/react-router";
import OrgHeader from "./org-header";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

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
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
