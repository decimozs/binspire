import { NavOperations } from "./nav-operations";
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

type SidebarProps = {
  user: User;
  userId: string;
};

const RoleBasedSidebar = ({
  user,
  userId,
  role,
}: SidebarProps & { role: User["role"] }) => {
  const data = role === "admin" ? adminData : collectorData;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavActiveTeams />
      </SidebarHeader>
      <SidebarContent>
        <NavOperations items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userId={userId} user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export function DashboardSidebar({
  user,
  userId,
}: {
  user: User;
  userId: string;
}) {
  return <RoleBasedSidebar userId={userId} user={user} role={user.role} />;
}
