import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import UserInvitationsDataTable from "@/features/user-invitations/components/data-table";
import {
  queryOptions,
  UserInvitationsApi,
  useSuspenseQuery,
  type UserInvitation,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["user-invitations"],
  queryFn: UserInvitationsApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/invitations",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: invitations } = useSuspenseQuery(routeQueryOpts);

  console.log("data: ", invitations);

  const pendingInvitationCounts = invitations.filter(
    (invitation) => invitation.status === "pending",
  ).length;
  const acceptedInvitationCounts = invitations.filter(
    (invitation) => invitation.status === "accepted",
  ).length;
  const expiredInvitationCounts = invitations.filter(
    (invitation) => invitation.status === "expired",
  ).length;
  const rejectedInvitationCounts = invitations.filter(
    (invitation) => invitation.status === "rejected",
  ).length;
  const confirmedInvitationCounts = invitations.filter(
    (invitation) => invitation.status === "confirmed",
  ).length;

  const adminInvitationCounts = invitations.filter(
    (invitations) => invitations.role === "admin",
  ).length;
  const maintenanceInvitationCounts = invitations.filter(
    (invitations) => invitations.role === "maintenance",
  ).length;

  const superUserPermissionCounts = invitations.filter(
    (invitation) => invitation.permission === "superuser",
  ).length;
  const viewerPermissionCounts = invitations.filter(
    (invitation) => invitation.permission === "viewer",
  );
  const editorPermissionCounts = invitations.filter(
    (invitation) => invitation.permission === "editor",
  );

  return (
    <AnalyticsOverview<UserInvitation>
      data={invitations}
      queryKey="user-invitations"
      title="Invitations"
      description="Overview of all invitations"
      dataTableSource="/invitations"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Invitations"
            description="Invitation Status Breakdown"
            data={[
              { role: "Pending", count: pendingInvitationCounts },
              { role: "Accepted", count: acceptedInvitationCounts },
              { role: "Confirmed", count: confirmedInvitationCounts },
              { role: "Rejected", count: rejectedInvitationCounts },
              { role: "Expired", count: expiredInvitationCounts },
            ]}
            config={{
              Pending: { label: "Pending", color: "var(--chart-1)" },
              Accepted: { label: "Accepted", color: "var(--chart-2)" },
              Confirmed: { label: "Confirmed", color: "var(--chart-3)" },
              Rejected: { label: "Rejected", color: "var(--chart-4)" },
              Expired: { label: "Expired", color: "var(--chart-5)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="All invitations in the system"
          />
          <TotalPieChart
            title="Invitations by Role"
            description="Distribution of invitations based on role"
            data={[
              { role: "Admin", count: adminInvitationCounts },
              { role: "Maintenance", count: maintenanceInvitationCounts },
            ]}
            config={{
              Admin: { label: "Admin", color: "var(--chart-1)" },
              Maintenance: { label: "Maintenance", color: "var(--chart-2)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Breakdown by user roles"
          />

          <TotalPieChart
            title="Invitations by Permission"
            description="Distribution of invitations based on permission level"
            data={[
              { role: "Superuser", count: superUserPermissionCounts },
              { role: "Editor", count: editorPermissionCounts.length },
              { role: "Viewer", count: viewerPermissionCounts.length },
            ]}
            config={{
              Superuser: { label: "Superuser", color: "var(--chart-1)" },
              Editor: { label: "Editor", color: "var(--chart-2)" },
              Viewer: { label: "Viewer", color: "var(--chart-3)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Breakdown by permission levels"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <UserInvitationsDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
