import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SeparatorVertical, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Separator } from "../ui/separator";

export default function CommandCentralMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => handleSelect("/dashboard/")}>
            <div className="flex items-center gap-2 cursor-pointer">
              <UserRound />
              <span>Map</span>
            </div>
          </CommandItem>
        </CommandGroup>
        <Separator />
        <CommandGroup heading="Manage Users">
          <CommandItem
            onSelect={() => handleSelect("/dashboard/user/management")}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <UserRound />
              <span>User Management</span>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect("/dashboard/user/access-requests")}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <UserRound />
              <span>Access Requests</span>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect("/dashboard/user/activity-logs")}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <UserRound />
              <span>Activity Logs</span>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect("/dashboard/user/roles-permissions")}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <UserRound />
              <span>Roles & Permissions</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
