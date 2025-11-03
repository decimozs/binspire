import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import UserRequest from "@/features/user-requests";
import {
  queryOptions,
  UserRequestApi,
  useSuspenseQuery,
} from "@binspire/query";

const routeQueryOpts = queryOptions({
  queryKey: ["user-requests"],
  queryFn: UserRequestApi.getAll,
});

export const Route = createFileRoute("/_authenticated/requests/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: requests } = useSuspenseQuery(routeQueryOpts);
  return <UserRequest data={requests} />;
}
