import {
  ChevronRight,
  CircleQuestionMark,
  DatabaseBackup,
  Gift,
  HeartHandshake,
  Info,
  Palette,
  Settings,
  Settings2,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@binspire/ui/components/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@binspire/ui/components/collapsible";
import type { MenuItem } from "@binspire/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";

const otherMenus: MenuItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    items: [
      {
        title: "General",
        url: "/settings",
        icon: Settings2,
      },
      {
        title: "Appearance",
        url: "/settings/appearance",
        icon: Palette,
      },
      {
        title: "Backup",
        url: "/settings/backup",
        icon: DatabaseBackup,
      },
      {
        title: "About",
        url: "/settings/about",
        icon: Info,
      },
    ],
  },
  { title: "Green Hearts", url: "/green-hearts", icon: HeartHandshake },
  { title: "Rewards", url: "/rewards", icon: Gift },
  { title: "Help Center", url: "/help-center", icon: CircleQuestionMark },
];

export function OtherMenu() {
  const location = useLocation();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isSettingsActive = [
    "/settings",
    "/settings/appearance",
    "/settings/backup",
    "/settings/about",
  ].includes(location.pathname);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Other</SidebarGroupLabel>
      <SidebarMenu>
        {otherMenus.map((item) => (
          <SidebarMenuItem key={item.title} className="relative">
            {item.items ? (
              <>
                <Collapsible asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={
                          item.title === "Settings" && isSettingsActive
                            ? "bg-muted rounded-md text-primary"
                            : ""
                        }
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              onClick={() => setOpenMobile(false)}
                            >
                              <Link to={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {isCollapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`absolute inset-0 w-full h-full opacity-0 ${
                          item.title === "Settings" && isSettingsActive
                            ? "bg-muted rounded-md text-primary"
                            : ""
                        }`}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="right"
                      align="start"
                      className="w-[200px]"
                    >
                      <DropdownMenuLabel>Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="flex flex-col gap-1">
                        {item.items.map((subItem) => (
                          <DropdownMenuItem
                            key={subItem.title}
                            className={
                              location.pathname === subItem.url
                                ? "bg-muted rounded-md text-primary"
                                : ""
                            }
                          >
                            <Link
                              to={subItem.url}
                              className="flex flex-row items-center gap-1"
                              onClick={() => setOpenMobile(false)}
                            >
                              {subItem.icon && (
                                <subItem.icon
                                  className={`mr-2 ${
                                    location.pathname === subItem.url
                                      ? "text-primary"
                                      : ""
                                  }`}
                                />
                              )}
                              {subItem.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            ) : (
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={
                  location.pathname === item.url
                    ? "bg-muted rounded-md text-primary"
                    : ""
                }
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
