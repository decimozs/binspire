import LoaderLayout from "@/components/layout/loader-layout";
import GreenHearts from "@/features/green-hearts";
import {
  queryOptions,
  UserGreenHeartApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["user-green-hearts"],
  queryFn: UserGreenHeartApi.getAll,
});

export const Route = createFileRoute("/_authenticated/green-hearts/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: greenhearts } = useSuspenseQuery(routeQueryOpts);

  return <GreenHearts data={greenhearts} />;
}
