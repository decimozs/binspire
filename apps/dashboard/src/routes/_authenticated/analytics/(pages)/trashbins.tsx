import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import TrashbinsDataTable from "@/features/trashbins/components/data-table";
import {
  queryOptions,
  TrashbinApi,
  useSuspenseQuery,
  type Trashbin,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["trashbins"],
  queryFn: TrashbinApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/trashbins",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: trashbins } = useSuspenseQuery(routeQueryOpts);

  const biodegradableTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.wasteType === "biodegradable",
  ).length;
  const nonBiodegradableTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.wasteType === "non-biodegradable",
  ).length;
  const recyclableTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.wasteType === "recyclable",
  ).length;

  const operationalTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.status.isOperational,
  ).length;
  const nonOperationalTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.status.isOperational === false,
  ).length;

  const collectedTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.status.isCollected,
  ).length;
  const notCollectedTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.status.isCollected === false,
  ).length;

  const scheduledTrashbinCounts = trashbins.filter(
    (trashbin) => trashbin.status.isScheduled,
  ).length;

  return (
    <AnalyticsOverview<Trashbin>
      data={trashbins}
      queryKey="trashbins"
      title="Trashbins"
      description="Overview of all generated trashbins"
      dataTableSource="/trashbins"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Trashbins"
            description="System Breakdown"
            data={[
              { role: "Biodegradable", count: biodegradableTrashbinCounts },
              {
                role: "Non-biodegradable",
                count: nonBiodegradableTrashbinCounts,
              },
              { role: "Recyclable", count: recyclableTrashbinCounts },
            ]}
            config={{
              Biodegradable: {
                label: "Biodegradable",
                color: "var(--chart-1)",
              },
              "Non-biodegradable": {
                label: "Non-biodegradable",
                color: "var(--chart-2)",
              },
              Recyclable: { label: "Recyclable", color: "var(--chart-3)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Total trashbins avaialble in the community"
          />
          <TotalPieChart
            title="Operational Status"
            description="Operational vs Non-Operational Trashbins"
            data={[
              { role: "Operational", count: operationalTrashbinCounts },
              { role: "Non-Operational", count: nonOperationalTrashbinCounts },
            ]}
            config={{
              Operational: { label: "Operational", color: "var(--chart-1)" },
              "Non-Operational": {
                label: "Non-Operational",
                color: "var(--chart-2)",
              },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Trashbins classified by operational status"
          />
          <TotalPieChart
            title="Collection Status"
            description="Collected vs Not Collected Trashbins"
            data={[
              { role: "Collected", count: collectedTrashbinCounts },
              { role: "Not Collected", count: notCollectedTrashbinCounts },
            ]}
            config={{
              Collected: { label: "Collected", color: "var(--chart-1)" },
              "Not Collected": {
                label: "Not Collected",
                color: "var(--chart-2)",
              },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Trashbins classified by collection status"
          />

          <TotalPieChart
            title="Scheduled Trashbins"
            description="Trashbins scheduled for collection"
            data={[{ role: "Scheduled", count: scheduledTrashbinCounts }]}
            config={{
              Scheduled: { label: "Scheduled", color: "var(--chart-1)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Distribution of scheduled vs unscheduled trashbins"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <TrashbinsDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
