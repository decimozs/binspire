import {
  queryOptions,
  type UserRequest,
  UserRequestApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import UserRequestsDataTable from "@/features/user-requests/components/data-table";

const routeQueryOpts = queryOptions({
  queryKey: ["user-requests"],
  queryFn: UserRequestApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/requests",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: requests } = useSuspenseQuery(routeQueryOpts);

  const pendingRequestsCounts = requests.filter(
    (request) => request.status === "pending",
  ).length;
  const approvedRequestsCounts = requests.filter(
    (request) => request.status === "approved",
  ).length;
  const rejectedRequestsCounts = requests.filter(
    (request) => request.status === "rejected",
  ).length;

  return (
    <AnalyticsOverview<UserRequest>
      data={requests}
      queryKey="user-requests"
      title="Requests"
      description="Overview of requests"
      dataTableSource="/requests"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Requests"
            description="System Breakdown"
            data={[
              { role: "Pending", count: pendingRequestsCounts },
              { role: "Approved", count: approvedRequestsCounts },
              { role: "Rejected", count: rejectedRequestsCounts },
            ]}
            config={{
              Pending: { label: "Pending", color: "var(--chart-1)" },
              Approved: { label: "Approved", color: "var(--chart-2)" },
              Rejected: { label: "Rejected", color: "var(--chart-3)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText={"Total requests in the system"}
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <UserRequestsDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
