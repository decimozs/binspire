import {
  AuditApi,
  queryOptions,
  TrashbinCollectionsApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import Activity from "@/features/activity";
import { useSession } from "@/features/auth";

const collectionsQueryOpts = queryOptions({
  queryKey: ["trashbin-collections"],
  queryFn: TrashbinCollectionsApi.getAll,
});

const auditsQueryOpts = queryOptions({
  queryKey: ["audits"],
  queryFn: AuditApi.getAll,
});

export const Route = createFileRoute("/_authenticated/activity/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(collectionsQueryOpts),
      context.queryClient.ensureQueryData(auditsQueryOpts),
    ]);
  },
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: current } = useSession();
  const { data: rawCollections } = useSuspenseQuery(collectionsQueryOpts);
  const { data: rawAudits } = useSuspenseQuery(auditsQueryOpts);

  const collections = rawCollections.filter(
    (collection) => collection.collectedBy === current?.user.id,
  );

  const audits = rawAudits.filter(
    (audit) =>
      audit.userId === current?.user.id &&
      audit.entity === "trashbinManagement" &&
      audit.action === "create",
  );

  return <Activity collections={collections} audits={audits} />;
}
