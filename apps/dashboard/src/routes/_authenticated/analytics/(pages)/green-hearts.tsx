import type { UserGreenHeart } from "@binspire/query";
import {
  queryOptions,
  UserGreenHeartApi,
  useSuspenseQuery,
} from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import GreenHeartsDataTable from "@/features/green-hearts/components/data-table";

const routeQueryOpts = queryOptions({
  queryKey: ["user-green-hearts"],
  queryFn: UserGreenHeartApi.getAll,
});

export const Route = createFileRoute(
  "/_authenticated/analytics/(pages)/green-hearts",
)({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: greenhearts } = useSuspenseQuery(routeQueryOpts);

  const totals = greenhearts.reduce(
    (acc, gh) => {
      acc.points += gh.points ?? 0;
      acc.totalKg += gh.totalKg ?? 0;
      acc.materials.plastic += gh.plastic ?? 0;
      acc.materials.paper += gh.paper ?? 0;
      acc.materials.metal += gh.metal ?? 0;
      acc.materials.glass += gh.glass ?? 0;
      return acc;
    },
    {
      points: 0,
      totalKg: 0,
      materials: {
        plastic: 0,
        paper: 0,
        metal: 0,
        glass: 0,
      },
    },
  );

  const materialTotal =
    totals.materials.plastic +
    totals.materials.paper +
    totals.materials.metal +
    totals.materials.glass;

  return (
    <AnalyticsOverview<UserGreenHeart>
      data={greenhearts}
      queryKey="user-green-hearts"
      title="Green Hearts"
      description="Overview of Green Hearts collected by users"
      dataTableSource="/user-green-hearts"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Points"
            description="Sum of all points collected"
            data={[{ role: "Points", count: totals.points }]}
            config={{ Points: { label: "Points", color: "var(--chart-1)" } }}
            dataKey="count"
            nameKey="role"
            footerSubText="Total points accumulated by users"
          />

          <TotalPieChart
            title="Total Weight"
            description="Total kg collected per material"
            data={[
              { role: "Plastic", count: totals.materials.plastic },
              { role: "Paper", count: totals.materials.paper },
              { role: "Metal", count: totals.materials.metal },
              { role: "Glass", count: totals.materials.glass },
            ]}
            config={{
              Plastic: { label: "Plastic", color: "var(--chart-1)" },
              Paper: { label: "Paper", color: "var(--chart-2)" },
              Metal: { label: "Metal", color: "var(--chart-3)" },
              Glass: { label: "Glass", color: "var(--chart-4)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText={`Total kg collected: ${materialTotal} kg`}
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <GreenHeartsDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
