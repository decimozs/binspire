import {
  queryOptions,
  TrashbinCollectionsApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import TrashbinCollections from "@/features/trashbin-collections";

const routeQueryOpts = queryOptions({
  queryKey: ["trashbin-collections"],
  queryFn: TrashbinCollectionsApi.getAll,
});

export const Route = createFileRoute("/_authenticated/collections/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: collections } = useSuspenseQuery(routeQueryOpts);

  return <TrashbinCollections data={collections} />;
}
