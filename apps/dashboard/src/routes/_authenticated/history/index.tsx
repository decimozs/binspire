import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import History from "@/features/history";
import { HistoryApi, queryOptions, useSuspenseQuery } from "@binspire/query";

const routeQueryOpts = queryOptions({
  queryKey: ["histories"],
  queryFn: HistoryApi.getAll,
});

export const Route = createFileRoute("/_authenticated/history/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: history } = useSuspenseQuery(routeQueryOpts);
  return <History data={history} />;
}
