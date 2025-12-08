import {
  type Issue,
  IssueApi,
  queryOptions,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import MostBarChart from "@/features/analytics/components/most-bar-chart";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import IssuesDataTable from "@/features/issues/components/data-table";

const routeQueryOpts = queryOptions({
  queryKey: ["issues"],
  queryFn: IssueApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/issues",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: issues } = useSuspenseQuery(routeQueryOpts);

  const openIssueCounts = issues.filter(
    (issue) => issue.status === "open",
  ).length;
  const closedIssueCounts = issues.filter(
    (issue) => issue.status === "closed",
  ).length;
  const inProgressIssueCounts = issues.filter(
    (issue) => issue.status === "in_progress",
  ).length;
  const resolvedIssueCounts = issues.filter(
    (issue) => issue.status === "resolved",
  ).length;

  const entityCounts = issues.reduce<Record<string, number>>((acc, issue) => {
    const entity = issue.entity || "Unknown"; // fallback
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
    <AnalyticsOverview<Issue>
      queryKey="issues"
      data={issues}
      title="Issues"
      description="Overview of Issues"
      dataTableSource="/issues"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Issues"
            description="Issue Status Breakdown"
            data={[
              { role: "Open", count: openIssueCounts },
              { role: "Closed", count: closedIssueCounts },
              { role: "In Progress", count: inProgressIssueCounts },
              { role: "Resolved", count: resolvedIssueCounts },
            ]}
            config={{
              Open: { label: "Open", color: "var(--chart-1)" },
              Closed: { label: "Closed", color: "var(--chart-2)" },
              "In Progress": { label: "In Progress", color: "var(--chart-3)" },
              Resolved: { label: "Resolved", color: "var(--chart-4)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="All of the issues in the system"
          />

          {openIssueCounts > 0 && (
            <TotalPieChart
              title="Open Issues"
              description="Count of all open issues"
              data={[{ role: "Open", count: openIssueCounts }]}
              config={{
                Open: { label: "Open", color: "var(--chart-1)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`Total issues: ${openIssueCounts}`}
            />
          )}

          {closedIssueCounts > 0 && (
            <TotalPieChart
              title="Closed Issues"
              description="Count of all closed issues"
              data={[{ role: "Closed", count: closedIssueCounts }]}
              config={{
                Closed: { label: "Closed", color: "var(--chart-1)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`Total issues: ${closedIssueCounts}`}
            />
          )}

          {inProgressIssueCounts > 0 && (
            <TotalPieChart
              title="In Progress Issues"
              description="Count of all issues in progress"
              data={[{ role: "In Progress", count: inProgressIssueCounts }]}
              config={{
                "In Progress": {
                  label: "In Progress",
                  color: "var(--chart-1)",
                },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`Total issues: ${inProgressIssueCounts}`}
            />
          )}

          {resolvedIssueCounts > 0 && (
            <TotalPieChart
              title="Resolved Issues"
              description="Count of all resolved issues"
              data={[{ role: "Resolved", count: resolvedIssueCounts }]}
              config={{
                resolved: { label: "Resolved", color: "var(--chart-1)" },
              }}
              dataKey="count"
              nameKey="role"
              footerSubText={`Total issues: ${resolvedIssueCounts}`}
            />
          )}

          <MostBarChart
            title="Most Affected Entities"
            description="Entities impacted the most by issues"
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
            footerSubText="Top entities involved in issues"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <IssuesDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
