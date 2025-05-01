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
import type { Notification, User } from "@/lib/types";

const AdminSidebar = ({
  user,
  userId,
  onlineAdmins,
  onlineCollectors,
  notifications,
}: {
  user: User;
  userId: string;
  onlineAdmins: number;
  onlineCollectors: number;
  notifications: Notification[];
}) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavActiveTeams
          teams={collectorData.teams}
          onlineCollectors={onlineCollectors}
          onlineAdmins={onlineAdmins}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavOperations items={adminData.navMain} />
        <NavShortcuts projects={adminData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userId={userId} user={user} notifications={notifications} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const CollectorSidebar = ({
  user,
  userId,
  onlineAdmins,
  onlineCollectors,
  notifications,
}: {
  user: User;
  userId: string;
  onlineAdmins: number;
  onlineCollectors: number;
  notifications: Notification[];
}) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavActiveTeams
          teams={collectorData.teams}
          onlineCollectors={onlineCollectors}
          onlineAdmins={onlineAdmins}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavOperations items={collectorData.navMain} />
        <NavShortcuts projects={collectorData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userId={userId} user={user} notifications={notifications} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export function DashboardSidebar({
  user,
  userId,
  onlineAdmins,
  onlineCollectors,
  notifications,
}: {
  user: User;
  userId: string;
  onlineAdmins: number;
  onlineCollectors: number;
  notifications: Notification[];
}) {
  return (
    <>
      {user?.role === "admin" && (
        <AdminSidebar
          userId={userId}
          user={user}
          onlineCollectors={onlineCollectors}
          onlineAdmins={onlineAdmins}
          notifications={notifications}
        />
      )}
      {user?.role === "collector" && (
        <CollectorSidebar
          userId={userId}
          user={user}
          onlineAdmins={onlineAdmins}
          onlineCollectors={onlineCollectors}
          notifications={notifications}
        />
      )}
    </>
  );
}
