import { NavOperations } from "./nav-operations";
import { NavShortcuts } from "./nav-shortcuts";
import NavActiveTeams from "./nav-teams";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { adminData, collectorData } from "@/lib/constants";
import type { User } from "@/lib/types";

const AdminSidebar = ({ user }: { user: User }) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavActiveTeams teams={adminData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavOperations items={adminData.navMain} />
        <NavShortcuts projects={adminData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const CollectorSidebar = ({ user }: { user: User }) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavActiveTeams teams={collectorData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavOperations items={collectorData.navMain} />
        <NavShortcuts projects={collectorData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export function DashboardSidebar({ user }: { user?: User }) {
  return (
    <>
      {user?.role === "admin" && <AdminSidebar user={user} />}
      {user?.role === "collector" && <CollectorSidebar user={user} />}
    </>
  );
}
