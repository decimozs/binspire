import { AuditApi, queryOptions, useSuspenseQuery } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import Audits from "@/features/audits";

const routeQueryOpts = queryOptions({
  queryKey: ["audits"],
  queryFn: AuditApi.getAll,
});

export const Route = createFileRoute("/_authenticated/audits/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: audits } = useSuspenseQuery(routeQueryOpts);
  return <Audits data={audits} />;
}
