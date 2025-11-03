import { Loader2, LogOutIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@binspire/ui/components/sidebar";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { getInitial } from "@binspire/shared";
import { ShowToast } from "../core/toast-notification";

export function SidebarUser() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!session) {
    return (
      <Avatar>
        <Skeleton className="h-10 w-10 rounded-full" />
      </Avatar>
    );
  }

  const user = session.user;

  const handleLogout = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.signOut();

      if (!data?.success || error) throw new Error(error?.message);

      setTimeout(() => {
        window.location.href =
          process.env.NODE_ENV === "development"
            ? `http://localhost:5173/login`
            : `https://www.binspire.space/login`;
      }, 1000);

      ShowToast("success", "Logout successfully.");
    } catch (err) {
      const error = err as Error;
      ShowToast(
        "error",
        error.message || "Failed to logout. Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent"
            >
              <Avatar>
                <AvatarImage src={user.image || ""} alt="Profile image" />
                <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p>{user.name}</p>
                <p className="-mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[200px]"
            side={"right"}
            align={"end"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-sm font-medium">
                {user.name}
              </span>
              <span className="text-muted-foreground truncate text-xs font-normal">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  navigate({
                    to: "/users/$userId",
                    params: { userId: user.id },
                  })
                }
              >
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/settings" })}
                className="cursor-pointer"
              >
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <LogOutIcon
                  size={16}
                  className="me-2 opacity-60"
                  aria-hidden="true"
                />
              )}
              <span className="-ml-2">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
