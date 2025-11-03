import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import MostBarChart from "@/features/analytics/components/most-bar-chart";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import AuditDataTable from "@/features/audits/components/data-table";
import {
  AuditApi,
  queryOptions,
  useSuspenseQuery,
  type Audit,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

const routeQueryOpts = queryOptions({
  queryKey: ["audits"],
  queryFn: AuditApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/audits",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: audits } = useSuspenseQuery(routeQueryOpts);

  const auditCounts = audits.length;

  const createActionCounts = audits.filter(
    (audit) => audit.action === "create",
  ).length;
  const updateActionCounts = audits.filter(
    (audit) => audit.action === "update",
  ).length;
  const deleteActionCounts = audits.filter(
    (audit) => audit.action === "delete",
  ).length;
  const restoreActionCounts = audits.filter(
    (audit) => audit.action === "restore",
  ).length;
  const archiveActionCounts = audits.filter(
    (audit) => audit.action === "archive",
  ).length;

  const entityCounts = audits.reduce<Record<string, number>>((acc, audit) => {
    const entity = audit.entity || "Unknown"; // fallback
    acc[entity] = (acc[entity] || 0) + 1;
    return acc;
  }, {});

  const entityData = Object.entries(entityCounts)
    .map(([entity, count]) => ({
      name: entity,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <AnalyticsOverview<Audit>
      queryKey="audits"
      data={audits}
      title="Audits"
      description="Overview of Audit Records"
      dataTableSource="/audits"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Audits"
            description="System Breakdown"
            data={[{ role: "Audit Records", count: auditCounts }]}
            config={{
              "Audit Records": {
                label: "Audit Records",
                color: "var(--chart-1)",
              },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Total audits in the system"
          />

          <TotalPieChart
            title="Audit Actions"
            description="Breakdown by action type"
            data={[
              { role: "Create", count: createActionCounts },
              { role: "Update", count: updateActionCounts },
              { role: "Delete", count: deleteActionCounts },
              { role: "Restore", count: restoreActionCounts },
              { role: "Archive", count: archiveActionCounts },
            ]}
            config={{
              Create: { label: "Create", color: "var(--chart-1)" },
              Update: { label: "Update", color: "var(--chart-2)" },
              Delete: { label: "Delete", color: "var(--chart-3)" },
              Restore: { label: "Restore", color: "var(--chart-4)" },
              Archive: { label: "Archive", color: "var(--chart-5)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Distribution of actions across all audits"
          />
          <MostBarChart
            title="Most Affected Entities"
            description="Entities impacted the most by audits"
            data={entityData}
            config={entityData.reduce(
              (acc, { name }, index) => {
                acc[name] = {
                  label: name,
                  color: `var(--chart-${(index % 5) + 1})`,
                };
                return acc;
              },
              {} as Record<string, { label: string; color: string }>,
            )}
            dataKey="count"
            nameKey="name"
            footerSubText="Top entities involved in audit activities"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <AuditDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
