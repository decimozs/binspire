import {
  queryOptions,
  TrashbinCollectionsApi,
  useSuspenseQuery,
  type TrashbinCollections,
} from "@binspire/query";
import LoaderLayout from "@/components/layout/loader-layout";
import AnalyticsOverview from "@/features/analytics/components/analytics-overview";
import MostBarChart from "@/features/analytics/components/most-bar-chart";
import { TotalPieChart } from "@/features/analytics/components/total-pie-chart";
import TrashbinCollectionsDataTable from "@/features/trashbin-collections/components/data-table";
import { createFileRoute } from "@tanstack/react-router";
import { getStatus, TRASHBIN_CONFIG } from "@binspire/shared";

const routeQueryOpts = queryOptions({
  queryKey: ["trashbin-collections"],
  queryFn: TrashbinCollectionsApi.getAll,
});

export const Route = createFileRoute("/_authenticated/analytics/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data: collections } = useSuspenseQuery(routeQueryOpts);

  const fullTrashbinCounts = collections.filter(
    (collection) => collection.isFull === true,
  ).length;
  const notFullTrashbinCounts = collections.filter(
    (collection) => collection.isFull === false,
  ).length;

  const averageWasteLevel =
    collections.reduce((sum, i) => sum + (i.wasteLevel ?? 0), 0) /
    (collections.length || 1);

  const wasteLevelStatuses = collections.map((c) =>
    getStatus(c.wasteLevel ?? 0, "waste-level"),
  );
  const wasteLevelCounts = wasteLevelStatuses.reduce<Record<string, number>>(
    (acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );
  const wasteLevelData = Object.entries(wasteLevelCounts).map(
    ([status, count]) => {
      const label =
        TRASHBIN_CONFIG["waste-level"][
          status as keyof (typeof TRASHBIN_CONFIG)["waste-level"]
        ].label;
      return { status, label, count };
    },
  );

  const weightLevelStatuses = collections.map((c) =>
    getStatus(c.weightLevel ?? 0, "weight-level"),
  );
  const weightLevelCounts = weightLevelStatuses.reduce<Record<string, number>>(
    (acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );
  const weightLevelData = Object.entries(weightLevelCounts).map(
    ([status, count]) => {
      const label =
        TRASHBIN_CONFIG["weight-level"][
          status as keyof (typeof TRASHBIN_CONFIG)["weight-level"]
        ].label;
      return { status, label, count };
    },
  );

  const batteryLevelStatuses = collections.map((c) =>
    getStatus(c.batteryLevel ?? 0, "battery-level"),
  );
  const batteryLevelCounts = batteryLevelStatuses.reduce<
    Record<string, number>
  >((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const batteryLevelData = Object.entries(batteryLevelCounts).map(
    ([status, count]) => {
      const label =
        TRASHBIN_CONFIG["battery-level"][
          status as keyof (typeof TRASHBIN_CONFIG)["battery-level"]
        ].label;
      return { status, label, count };
    },
  );

  const trashbinCounts = collections.reduce<Record<string, number>>(
    (acc, c) => {
      const name = c.trashbin.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {},
  );

  const trashbinData = Object.entries(trashbinCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <AnalyticsOverview<TrashbinCollections>
      data={collections}
      title="Trashbin Collections"
      description="Overview of all trashbin collections"
      dataTableSource="/collections"
      queryKey="trashbin-collections"
      renderFilteredCharts={() => (
        <>
          <TotalPieChart
            title="Total Collections"
            description="System Breakdown"
            data={[
              { role: "Full", count: fullTrashbinCounts },
              { role: "Not Full", count: notFullTrashbinCounts },
            ]}
            config={{
              Collections: { label: "Collections", color: "var(--chart-1)" },
              Full: { label: "Full", color: "var(--chart-1)" },
              "Not Full": { label: "Not Full", color: "var(--chart-2)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Total collections happened in the system"
          />

          <TotalPieChart
            title="Average Waste Level"
            description="Average fill percentage across bins"
            data={[
              {
                role: "Average Waste Level",
                count: Number(averageWasteLevel.toFixed(1)),
              },
            ]}
            config={{
              "Average Waste Level": {
                label: "Avg Waste",
                color: "var(--chart-1)",
              },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText={`Average waste level: ${averageWasteLevel.toFixed(1)}%`}
          />

          <TotalPieChart
            title="Trashbins by Waste Level"
            description="Breakdown of trashbin fill status"
            data={wasteLevelData}
            config={Object.fromEntries(
              Object.entries(TRASHBIN_CONFIG["waste-level"]).map(
                ([status, { label }], idx) => [
                  status,
                  {
                    label,
                    color: `var(--chart-${idx + 1})`,
                  },
                ],
              ),
            )}
            dataKey="count"
            nameKey="status"
            footerSubText="Distribution of bins by fill level"
          />

          <TotalPieChart
            title="Trashbins by Weight Level"
            description="Breakdown of trashbin weight status"
            data={weightLevelData}
            config={Object.fromEntries(
              Object.entries(TRASHBIN_CONFIG["weight-level"]).map(
                ([status, { label }], idx) => [
                  status,
                  {
                    label,
                    color: `var(--chart-${idx + 1})`,
                  },
                ],
              ),
            )}
            dataKey="count"
            nameKey="status"
            footerSubText="Distribution of bins by weight level"
          />

          <TotalPieChart
            title="Trashbins by Battery Level"
            description="Breakdown of trashbin battery status"
            data={batteryLevelData}
            config={Object.fromEntries(
              Object.entries(TRASHBIN_CONFIG["battery-level"]).map(
                ([status, { label }], idx) => [
                  status,
                  {
                    label,
                    color: `var(--chart-${idx + 1})`,
                  },
                ],
              ),
            )}
            dataKey="count"
            nameKey="status"
            footerSubText="Distribution of bins by battery level"
          />

          <MostBarChart
            title="Most Collected Trashbins"
            description="Bins with the highest number of collections"
            data={trashbinData}
            config={Object.fromEntries(
              trashbinData.map((bin, idx) => [
                bin.name,
                { label: bin.name, color: `var(--chart-${(idx % 6) + 1})` },
              ]),
            )}
            dataKey="count"
            nameKey="name"
            footerSubText="Based on total collection records"
          />

          <TotalPieChart
            title="Total Detection Logs"
            description="Total number of detections recorded across all collections"
            data={[
              {
                role: "Total Logs",
                count: collections.reduce(
                  (sum, c) => sum + (c.logs ? c.logs.length : 0),
                  0,
                ),
              },
            ]}
            config={{
              "Total Logs": { label: "Total Logs", color: "var(--chart-1)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Sum of all detection logs across every collection"
          />

          <TotalPieChart
            title="Collected Waste by Category"
            description="Breakdown of all waste types detected across collections"
            data={(() => {
              const allLogs =
                collections.flatMap((c) => (c.logs ? c.logs : [])) ?? [];

              const categoryCounts = allLogs.reduce<Record<string, number>>(
                (acc, log) => {
                  const wasteClass = log.class || "Unknown";
                  acc[wasteClass] = (acc[wasteClass] || 0) + 1;
                  return acc;
                },
                {},
              );

              return Object.entries(categoryCounts).map(([role, count]) => ({
                role,
                count,
              }));
            })()}
            config={(() => {
              const colorMap: Record<string, string> = {
                Plastics: "var(--chart-1)",
                Paper: "var(--chart-2)",
                "Electronic Device": "var(--chart-3)",
                Glass: "var(--chart-4)",
                Metal: "var(--chart-5)",
                Organic: "var(--chart-5)",
                Unknown: "var(--chart-3)",
              };

              return Object.fromEntries(
                Object.entries(colorMap).map(([label, color]) => [
                  label,
                  { label, color },
                ]),
              );
            })()}
            dataKey="count"
            nameKey="role"
            footerSubText="Distribution of all detected waste types across bins"
          />

          <TotalPieChart
            title="Detection Confidence Levels"
            description="Breakdown of AI detection confidence ranges"
            data={(() => {
              const allLogs = collections.flatMap((c) => c.logs ?? []);
              const confidenceBuckets = { Low: 0, Medium: 0, High: 0 };

              allLogs.forEach((log) => {
                const conf = log.confidence ?? log.confidence ?? 0;
                if (conf >= 0.8) confidenceBuckets.High++;
                else if (conf >= 0.5) confidenceBuckets.Medium++;
                else confidenceBuckets.Low++;
              });

              return Object.entries(confidenceBuckets).map(([role, count]) => ({
                role,
                count,
              }));
            })()}
            config={{
              High: { label: "High (≥ 0.8)", color: "var(--chart-1)" },
              Medium: { label: "Medium (0.5–0.79)", color: "var(--chart-2)" },
              Low: { label: "Low (< 0.5)", color: "var(--chart-3)" },
            }}
            dataKey="count"
            nameKey="role"
            footerSubText="Distribution of AI confidence levels in waste detection"
          />

          <MostBarChart
            title="Most Active Collection Times"
            description="Distribution of detections by time of day"
            data={(() => {
              const allLogs = collections.flatMap((c) => c.logs ?? []);
              const timeBuckets = {
                Morning: 0,
                Afternoon: 0,
                Evening: 0,
                Night: 0,
              };

              allLogs.forEach((log) => {
                const date = new Date(log.timestamp);
                const hour = date.getHours();
                if (hour >= 6 && hour < 12) timeBuckets.Morning++;
                else if (hour >= 12 && hour < 18) timeBuckets.Afternoon++;
                else if (hour >= 18 && hour < 24) timeBuckets.Evening++;
                else timeBuckets.Night++;
              });

              return Object.entries(timeBuckets).map(([name, count]) => ({
                name,
                count,
              }));
            })()}
            config={{
              Morning: { label: "Morning", color: "var(--chart-1)" },
              Afternoon: { label: "Afternoon", color: "var(--chart-2)" },
              Evening: { label: "Evening", color: "var(--chart-3)" },
              Night: { label: "Night", color: "var(--chart-4)" },
            }}
            dataKey="count"
            nameKey="name"
            footerSubText="Helps identify the busiest detection hours"
          />

          <TotalPieChart
            title="Detections by Location"
            description="Distribution of all detections grouped by bin location"
            data={(() => {
              const allLogs = collections.flatMap((c) =>
                (c.logs ?? []).map(() => ({
                  area: c.trashbin.location || "Unknown",
                })),
              );

              const areaCounts = allLogs.reduce<Record<string, number>>(
                (acc, log) => {
                  acc[log.area] = (acc[log.area] || 0) + 1;
                  return acc;
                },
                {},
              );

              return Object.entries(areaCounts).map(([role, count]) => ({
                role,
                count,
              }));
            })()}
            config={(() => {
              const areas = new Set(
                collections.map((c) => c.trashbin.location || "Unknown"),
              );
              return Object.fromEntries(
                Array.from(areas).map((a, idx) => [
                  a,
                  { label: a, color: `var(--chart-${(idx % 6) + 1})` },
                ]),
              );
            })()}
            dataKey="count"
            nameKey="role"
            footerSubText="Shows which locations generate the most detections"
          />
        </>
      )}
      renderRecentChangesTable={(data) => (
        <TrashbinCollectionsDataTable data={data} recentChangesMode={true} />
      )}
    />
  );
}
