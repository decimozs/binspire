import { IssueApi, queryOptions, useSuspenseQuery } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import Issues from "@/features/issues";

const routeQueryOpts = queryOptions({
  queryKey: ["issues"],
  queryFn: IssueApi.getAll,
});

export const Route = createFileRoute("/_authenticated/issues/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: issues } = useSuspenseQuery(routeQueryOpts);
  return <Issues data={issues} />;
}
