import LoaderLayout from "@/components/layout/loader-layout";
import Users from "@/features/users";
import { queryOptions, UserApi, useSuspenseQuery } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["users"],
  queryFn: UserApi.getAll,
});

export const Route = createFileRoute("/_authenticated/users/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: users } = useSuspenseQuery(routeQueryOpts);
  return <Users data={users} />;
}
