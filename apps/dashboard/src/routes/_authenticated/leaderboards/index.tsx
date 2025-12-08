import {
  queryOptions,
  UserApi,
  UserGreenHeartApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import Leaderboards from "@/features/leaderboards";

const usersQueryOpts = queryOptions({
  queryKey: ["users"],
  queryFn: UserApi.getAll,
});

const greenHeartsQueryOpts = queryOptions({
  queryKey: ["user-green-hearts"],
  queryFn: UserGreenHeartApi.getAll,
});

export const Route = createFileRoute("/_authenticated/leaderboards/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(usersQueryOpts),
      context.queryClient.ensureQueryData(greenHeartsQueryOpts),
    ]);
  },
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: users } = useSuspenseQuery(usersQueryOpts);
  const { data: greenHearts } = useSuspenseQuery(greenHeartsQueryOpts);

  return <Leaderboards data={users} greenHearts={greenHearts} />;
}
