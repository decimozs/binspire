import type { Audit, History } from "@binspire/query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@binspire/ui/components/card";
import {
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  XAxis,
} from "@binspire/ui/components/chart";
import { useMemo, useState } from "react";

export const description = "Audit + History contributions chart";

const chartConfig = {
  history: {
    label: "History",
    color: "var(--chart-1)",
  },
  audits: {
    label: "Audit Logs",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function UserContributions({
  historyData,
  auditLogsData,
}: {
  historyData: History[];
  auditLogsData: Omit<Audit, "user">[];
}) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("history");

  const chartData = useMemo(() => {
    const map: Record<
      string,
      { date: string; history: number; audits: number }
    > = {};

    historyData.forEach((h) => {
      const date = new Date(h.createdAt).toISOString().split("T")[0];
      if (!map[date]) map[date] = { date, history: 0, audits: 0 };
      map[date].history++;
    });

    auditLogsData.forEach((a) => {
      const date = new Date(a.createdAt).toISOString().split("T")[0];
      if (!map[date]) map[date] = { date, history: 0, audits: 0 };
      map[date].audits++;
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [historyData, auditLogsData]);

  const total = useMemo(
    () => ({
      history: chartData.reduce((acc, curr) => acc + curr.history, 0),
      audits: chartData.reduce((acc, curr) => acc + curr.audits, 0),
    }),
    [chartData],
  );

  return (
    <Card className="p-0 bg-background">
      <CardHeader className="flex flex-col items-stretch p-0 flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 ">
          <CardTitle>User Contributions</CardTitle>
          <CardDescription>
            Showing history and audit activity over time
          </CardDescription>
        </div>
        <div className="flex">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full bg-background"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
