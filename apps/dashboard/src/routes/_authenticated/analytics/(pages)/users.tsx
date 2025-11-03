import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import UsersDataTable from "@/features/users/components/data-table";
import {
  queryOptions,
  UserApi,
  useSuspenseQuery,
  type User,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["users"],
  queryFn: UserApi.getAll,
});

export const Route = createFileRoute("/_authenticated/analytics/(pages)/users")(
  {
    component: RouteComponent,
    loader: ({ context }) =>
      context.queryClient.ensureQueryData(routeQueryOpts),
    pendingComponent: LoaderLayout,
  },
);

function RouteComponent() {
  const { data: users } = useSuspenseQuery(routeQueryOpts);

  const adminUserCounts = users.filter(
    (user) => user.status.role === "admin",
  ).length;
  const maintenanceUserCounts = users.filter(
    (user) => user.status.role === "maintenance",
  ).length;
  const publicUserCounts =
    users.length - adminUserCounts - maintenanceUserCounts;
  const activeUserCounts = users.filter((user) => user.status.isOnline).length;
  const inactiveUserCounts = users.filter(
    (user) => user.status.isOnline === false,
  ).length;
  const verifiedUserCounts = users.filter((user) => user.emailVerified).length;
  const unverifiedUserCounts = users.filter(
    (user) => user.emailVerified === false,
  ).length;

  return (
    <AnalyticsOverview<User>
      data={users}
      title="Users"
      queryKey="users"
      description="Overview of all users"
      dataTableSource="/users"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Users"
            description="System Breakdown"
            data={[
              { role: "Admin", count: adminUserCounts },
              { role: "Maintenance", count: maintenanceUserCounts },
              { role: "Public User", count: publicUserCounts },
            ]}
            config={{
              Admin: { label: "Admin", color: "var(--chart-1)" },
              Maintenance: { label: "Maintenance", color: "var(--chart-2)" },
              "Public User": { label: "Public User", color: "var(--chart-3)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Total registered users in the system"
          />
          <TotalPieChart
            title="User Activity"
            description="Online vs Offline Users"
            data={[
              { status: "Active", count: activeUserCounts },
              { status: "Inactive", count: inactiveUserCounts },
            ]}
            config={{
              Active: { label: "Active", color: "var(--chart-4)" },
              Inactive: { label: "Inactive", color: "var(--chart-5)" },
            }}
            dataKey="count"
            nameKey="status"
            footerSubText="Distribution of active and inactive users"
          />
          <TotalPieChart
            title="Email Verification"
            description="Verified vs Unverified"
            data={[
              { status: "Verified", count: verifiedUserCounts },
              { status: "Unverified", count: unverifiedUserCounts },
            ]}
            config={{
              Verified: { label: "Verified", color: "var(--chart-1)" },
              Unverified: { label: "Unverified", color: "var(--chart-5)" },
            }}
            dataKey="count"
            nameKey="status"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <UsersDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
