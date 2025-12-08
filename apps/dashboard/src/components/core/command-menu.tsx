import type { MenuItem } from "@binspire/shared";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@binspire/ui/components/command";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ChartLine,
  CircleQuestionMark,
  Database,
  DatabaseBackup,
  Gift,
  HeartHandshake,
  History,
  Info,
  Key,
  LayoutDashboard,
  Mail,
  Map,
  Palette,
  Settings2,
  ShieldQuestionMark,
  Trash,
  Trophy,
  Users,
} from "lucide-react";
import { useSearch } from "@/context/search-provider";

const generalMenus: MenuItem[] & { icon: LucideIcon }[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Map", url: "/map", icon: Map },
  { title: "Leaderboard", url: "/leaderboards", icon: Trophy },
  { title: "Analytics", url: "/analytics", icon: ChartLine },
  { title: "Issue", url: "/issues", icon: Info },
  { title: "Audit", url: "/audits", icon: ShieldQuestionMark },
  { title: "History", url: "/history", icon: History },
  { title: "Users", url: "/users", icon: Users },
  { title: "Requests", url: "/requests", icon: Key },
  { title: "Invitations", url: "/invitations", icon: Mail },
  { title: "Trashbins", url: "/trashbins", icon: Trash },
  { title: "Collections", url: "/collections", icon: Database },
];

const suggestionsMenus: MenuItem[] = [
  {
    title: "Green Hearts",
    url: "/green-hearts",
    icon: HeartHandshake,
  },
  { title: "Map", url: "/map", icon: Map },
  { title: "Leaderboard", url: "/leaderboards", icon: Trophy },
  { title: "Trashbins", url: "/trashbins", icon: Trash },

  {
    title: "Rewards",
    url: "/rewards",
    icon: Gift,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
  { title: "Collections", url: "/collections", icon: Database },
  { title: "Help Center", url: "/help-center", icon: CircleQuestionMark },
];

const otherMenus: MenuItem[] = [
  {
    title: "Green Hearts",
    url: "/green-hearts",
    icon: HeartHandshake,
  },
  {
    title: "Rewards",
    url: "/rewards",
    icon: Gift,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
  { title: "Help Center", url: "/help-center", icon: CircleQuestionMark },
];

const settingsMenus: MenuItem[] = [
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
];

export default function CommandMenu() {
  const { open, setOpen } = useSearch();
  const navigate = useNavigate();

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="w-[600px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {suggestionsMenus.map((item) => {
            const Icon = item.icon as LucideIcon;

            return (
              <CommandItem
                key={item.title}
                className="flex flex-row gap-4"
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: item.url });
                }}
              >
                <Icon />
                {item.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Menu">
          {generalMenus.map((item) => {
            const Icon = item.icon as LucideIcon;

            return (
              <CommandItem
                key={item.title}
                className="flex flex-row gap-4"
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: item.url });
                }}
              >
                <Icon />
                {item.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Settings">
          {settingsMenus.map((item) => {
            const Icon = item.icon as LucideIcon;

            return (
              <CommandItem
                key={item.title}
                className="flex flex-row gap-4"
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: item.url });
                }}
              >
                <Icon />
                {item.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Others">
          {otherMenus.map((item) => {
            const Icon = item.icon as LucideIcon;

            return (
              <CommandItem
                key={item.title}
                className="flex flex-row gap-4"
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: item.url });
                }}
              >
                <Icon />
                {item.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
