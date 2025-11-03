import { useSession } from "@/features/auth";
import Rewards from "@/features/rewards";
import { useGetUserGreenHeartByUserId } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/rewards/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: current } = useSession();
  const { data: greenhearts } = useGetUserGreenHeartByUserId(current?.user.id!);

  return <Rewards data={greenhearts!} />;
}
