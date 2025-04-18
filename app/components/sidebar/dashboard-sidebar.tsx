import {
  AudioWaveform,
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  House,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Trash,
  UserRound,
} from "lucide-react";
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
import type { User } from "~/lib/types";

const data = {
  teams: [
    {
      name: "Admin",
      icon: GalleryVerticalEnd,
      onlines: "123",
    },
    {
      name: "Collector",
      icon: AudioWaveform,
      onlines: "42",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard",
        },
        {
          title: "Map",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
        {
          title: "History",
          url: "#",
        },
      ],
    },
    {
      title: "User",
      url: "#",
      icon: UserRound,
      items: [
        {
          title: "Management",
          url: "#",
        },
        {
          title: "Access Requests",
          url: "/dashboard/user/access-requests",
        },
        {
          title: "Activity Logs",
          url: "#",
        },
        {
          title: "Roles & Permissions",
          url: "#",
        },
      ],
    },
    {
      title: "Trashbin",
      url: "#",
      icon: Trash,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function DashboardSidebar({ user }: { user: User }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavActiveTeams teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavOperations items={data.navMain} />
        <NavShortcuts projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
