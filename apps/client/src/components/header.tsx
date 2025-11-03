import { useSession } from "@/features/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { getInitial } from "@binspire/shared";

function UserAvatar() {
  const { data: currentSession, isPending } = useSession();
  const routerState = useRouterState();
  const isNavigating = routerState.status === "pending";

  if (!currentSession || isPending || isNavigating) {
    return (
      <Avatar className="size-11 fixed top-5 right-6">
        <Skeleton className="w-full h-full" />
      </Avatar>
    );
  }

  const user = currentSession.user;

  return (
    <Avatar className="size-11 absolute top-5 right-6">
      <AvatarImage src={user.image || ""} />
      <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
    </Avatar>
  );
}

export default function Header() {
  const { pathname } = useLocation();

  const pageName =
    pathname === "/"
      ? "Home"
      : pathname
          .split("/")
          .filter(Boolean)
          .pop()
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

  const isOnMapPage = pathname === "/map";

  return (
    <header className="px-6 pt-5 w-full">
      <div>
        <p className="font-bold text-3xl">
          {isOnMapPage ? "Going on map..." : pageName}
        </p>
        {pathname === "/account" && <UserAvatar />}
      </div>
    </header>
  );
}
