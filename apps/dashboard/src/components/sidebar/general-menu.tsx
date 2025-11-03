import {
  ChartLine,
  Info,
  History,
  LayoutDashboard,
  Map,
  Users,
  Trash,
  Database,
  Mail,
  ShieldQuestionMark,
  Trophy,
  ClipboardList,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@binspire/ui/components/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import type { MenuItem } from "@binspire/shared";

const generalMenus: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Map", url: "/map", icon: Map },
  { title: "Leaderboard", url: "/leaderboards", icon: Trophy },
  { title: "Analytics", url: "/analytics", icon: ChartLine },
  { title: "Issue", url: "/issues", icon: Info },
  { title: "Audit", url: "/audits", icon: ShieldQuestionMark },
  { title: "History", url: "/history", icon: History },
  { title: "Users", url: "/users", icon: Users },
  { title: "Requests", url: "/requests", icon: ClipboardList },
  { title: "Invitations", url: "/invitations", icon: Mail },
  { title: "Trashbins", url: "/trashbins", icon: Trash },
  { title: "Collections", url: "/collections", icon: Database },
];

export function GeneralMenu() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {generalMenus.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={
                location.pathname === item.url ||
                location.pathname.startsWith(`${item.url}/`)
                  ? "bg-muted text-primary rounded-md"
                  : ""
              }
              onClick={() => setOpenMobile(false)}
            >
              <Link to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
