import type { MenuItem } from "@binspire/shared";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Activity, Briefcase, UserCircle, Map } from "lucide-react";

const menuItems: MenuItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Services", url: "/services", icon: Briefcase },
  { title: "Map", url: "/map", icon: Map },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "Account", url: "/account", icon: UserCircle },
];

function NavItem({ item }: { item: MenuItem }) {
  const { pathname } = useLocation();
  const Icon = item.icon;

  if (pathname === "/map") return null;

  const isServicesActive =
    pathname === "/services" ||
    pathname.startsWith("/register-trashbin") ||
    pathname.startsWith("/create-trashbin");

  const isActive =
    pathname === item.url ||
    (item.title === "Services" && isServicesActive) ||
    (item.title === "Account" && pathname === "/rewards");

  return (
    <Link
      to={item.url}
      key={item.title}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ease-in-out font-bold ${
        isActive ? "text-primary scale-105" : "text-muted-foreground scale-100"
      }`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <p className="text-sm">{item.title}</p>
    </Link>
  );
}

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full p-4 bg-background z-50">
      <div className="flex flex-row items-center justify-around text-white">
        {menuItems.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </div>
    </nav>
  );
}
