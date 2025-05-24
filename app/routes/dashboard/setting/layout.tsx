import type { Role } from "@/lib/types";
import {
  ArchiveRestore,
  FolderSync,
  Info,
  Paintbrush,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { useDashboardLayoutLoader } from "../layout";

interface Setting {
  label: string;
  url: string;
  icon: LucideIcon;
}

const settingItems: Array<Setting> = [
  {
    label: "General",
    url: "/dashboard/settings/general",
    icon: Settings,
  },
  {
    label: "Appearance",
    url: "/dashboard/settings/appearance",
    icon: Paintbrush,
  },
  {
    label: "Backup",
    url: "/dashboard/settings/backup",
    icon: FolderSync,
  },
  {
    label: "About",
    url: "/dashboard/settings/about",
    icon: Info,
  },
];

export default function SettingsLayoutRoute() {
  const loaderData = useDashboardLayoutLoader();
  const userRole = loaderData?.user?.role as Role;

  const visibleSettings = settingItems.filter(
    (item) => !(userRole === "collector" && item.label === "Backup"),
  );

  return (
    <div className="grid grid-cols-[1fr_4fr] mt-8 ml-8">
      <div className="flex flex-col gap-2">
        {visibleSettings.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              isActive
                ? "text-2xl flex flex-row items-center gap-2"
                : "text-muted-foreground text-2xl flex flex-row items-center gap-2"
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
