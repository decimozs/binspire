import { useGetOrganizationById } from "@binspire/query";
import { formatLabel } from "@binspire/shared";
import { SidebarMenu, SidebarMenuItem } from "@binspire/ui/components/sidebar";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { useLocation } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function OrgHeader() {
  const session = authClient.useSession();
  const location = useLocation();
  const { data: org, isPending } = useGetOrganizationById(
    session.data?.user.orgId as string,
  );

  if (isPending || !org) {
    return (
      <SidebarMenu>
        <Skeleton className="h-[33.5px] w-full rounded-md mt-4" />
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem
        className={`flex flex-row gap-4 mt-4 ${location.pathname === "/map" ? "ml-2" : ""}`}
      >
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <ArrowUpRight />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{formatLabel(org.name)}</span>
          <span className="truncate text-xs">Community</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
