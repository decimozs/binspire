import LoaderLayout from "@/components/layout/loader-layout";
import UserInvitation from "@/features/user-invitations";
import {
  queryOptions,
  UserInvitationsApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["user-invitations"],
  queryFn: UserInvitationsApi.getAll,
});

export const Route = createFileRoute("/_authenticated/invitations/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: invitations } = useSuspenseQuery(routeQueryOpts);
  return <UserInvitation data={invitations} />;
}
