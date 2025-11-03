import LoaderLayout from "@/components/layout/loader-layout";
import Rewards from "@/features/rewards";
import { authClient } from "@/lib/auth-client";
import { useGetUserGreenHeartByUserId } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/rewards/")({
  component: RouteComponent,
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: current } = authClient.useSession();
  const { data: greenhearts } = useGetUserGreenHeartByUserId(current?.user.id!);

  return <Rewards data={greenhearts!} />;
}
