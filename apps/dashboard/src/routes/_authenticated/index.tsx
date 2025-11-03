import Dashboard from "@/features/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import {
  AuditApi,
  HistoryApi,
  IssueApi,
  queryOptions,
  TrashbinApi,
  TrashbinCollectionsApi,
  UserApi,
  UserInvitationsApi,
  UserRequestApi,
  useSuspenseQuery,
} from "@binspire/query";
import LoaderLayout from "@/components/layout/loader-layout";

const routeQueryOpts = queryOptions({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const [
      users,
      collections,
      issues,
      audits,
      trashbins,
      invitations,
      requests,
      history,
    ] = await Promise.all([
      UserApi.getAll(),
      TrashbinCollectionsApi.getAll(),
      IssueApi.getAll(),
      AuditApi.getAll(),
      TrashbinApi.getAll(),
      UserInvitationsApi.getAll(),
      UserRequestApi.getAll(),
      HistoryApi.getAll(),
    ]);

    return {
      users,
      collections,
      issues,
      audits,
      trashbins,
      invitations,
      requests,
      history,
    };
  },
});

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(routeQueryOpts);

  return <Dashboard data={data} />;
}
