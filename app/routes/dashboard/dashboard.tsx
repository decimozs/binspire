import { useLoaderData, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/dashboard";
import DashboardMap from "@/components/map/dashboard-map";
import { useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/query/users.server";
import { logout } from "@/action/auth.server";
import { TrashbinQuery } from "@/query/trashbins.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);

  const trashbins = await TrashbinQuery.getAllTrashbins();

  return {
    user,
    trashbins,
  };
}

export function useDashboardLoader() {
  return useRouteLoaderData<typeof loader>("routes/dashboard/dashboard");
}

export async function action({ request }: Route.ActionArgs) {
  return await logout(request);
}

export default function DashboardPage() {
  const { user, trashbins } = useLoaderData<typeof loader>();

  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");

    if (!hasWelcomed) {
      toast.success(`Welcome back, ${user.data?.name}!`);
      sessionStorage.setItem("hasWelcomed", "true");
    }
  }, []);

  return <DashboardMap data={trashbins.data} />;
}
