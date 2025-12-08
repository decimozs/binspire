import { queryOptions, TrashbinApi, useSuspenseQuery } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import Trashbins from "@/features/trashbins";

const routeQueryOpts = queryOptions({
  queryKey: ["trashbins"],
  queryFn: TrashbinApi.getAll,
});

export const Route = createFileRoute("/_authenticated/trashbins/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: trashbins } = useSuspenseQuery(routeQueryOpts);
  return <Trashbins data={trashbins} />;
}
