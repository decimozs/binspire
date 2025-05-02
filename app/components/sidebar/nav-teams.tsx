import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import useActiveTeams from "@/hooks/use-active-teams";

export default function NavActiveTeams({
  onlineAdmins,
  onlineCollectors,
}: {
  onlineAdmins: number;
  onlineCollectors: number;
}) {
  const { isMobile } = useSidebar();
  const { activeAdmins, activeCollectors } = useActiveTeams();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/logo.png" className="rounded-sm" />
              </div>
              <div className="grid flex0 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Arcovia</span>
                <span className="truncate text-xs">Organization</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-55 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={5}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-399 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
              </span>
              Active
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-1 p-2">
              <div className="flex size-5 items-center justify-center rounded-sm border">
                <GalleryVerticalEnd className="size-3 shrink-0" />
              </div>
              Admin
              <DropdownMenuShortcut>{activeAdmins}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-1 p-2">
              <div className="flex size-5 items-center justify-center rounded-sm border">
                <GalleryVerticalEnd className="size-3 shrink-0" />
              </div>
              Collector
              <DropdownMenuShortcut>{activeCollectors}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
