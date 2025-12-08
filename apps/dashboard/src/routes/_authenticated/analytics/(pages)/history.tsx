import {
  type History,
  HistoryApi,
  queryOptions,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import HistoryDataTable from "@/features/history/components/data-table";

const routeQueryOpts = queryOptions({
  queryKey: ["histories"],
  queryFn: HistoryApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/history",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: history } = useSuspenseQuery(routeQueryOpts);

  const historyCounts = history.length;

  return (
    <AnalyticsOverview<History>
      data={history}
      queryKey="histories"
      title="History"
      description="Overview of history"
      dataTableSource="/history"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total History"
            description="System Breakdown"
            data={[{ role: "History", count: historyCounts }]}
            config={{
              History: { label: "History", color: "var(--chart-1)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Total history in the system"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <HistoryDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
