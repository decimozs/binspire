import type { MenuItem } from "@binspire/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ClipboardList,
  Database,
  HeartHandshake,
  History,
  Info,
  Mail,
  ShieldQuestionMark,
  Trash,
  Users,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

const generalMenus: MenuItem[] = [
  { title: "Issue", url: "/analytics/issues", icon: Info },
  { title: "Audit", url: "/analytics/audits", icon: ShieldQuestionMark },
  {
    title: "GreenHearts",
    url: "/analytics/green-hearts",
    icon: HeartHandshake,
  },
  { title: "History", url: "/analytics/history", icon: History },
  { title: "Users", url: "/analytics/users", icon: Users },
  { title: "Requests", url: "/analytics/requests", icon: ClipboardList },
  { title: "Invitations", url: "/analytics/invitations", icon: Mail },
  { title: "Trashbins", url: "/analytics/trashbins", icon: Trash },
  { title: "Collections", url: "/analytics", icon: Database },
];

export default function Analytics() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentMenu =
    generalMenus.find((m) => location.pathname.startsWith(m.url!)) ||
    generalMenus[generalMenus.length - 1];

  return (
    <MainLayout title="Analytics" description="View analytics and reports.">
      <div className="relative">
        <Select
          value={currentMenu.url}
          onValueChange={(value) => navigate({ to: value })}
        >
          <SelectTrigger className="w-[200px] absolute top-[-4rem] right-0 flex items-center gap-2 font-bold">
            <SelectValue placeholder="Navigate" />
          </SelectTrigger>
          <SelectContent>
            {generalMenus.map((menu) => {
              const MenuIcon = menu.icon;

              return (
                <SelectItem key={menu.url} value={menu.url as string}>
                  <div className="flex items-center gap-2">
                    {MenuIcon && <MenuIcon className="text-primary" />}
                    <span>{menu.title}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Outlet />
    </MainLayout>
  );
}
