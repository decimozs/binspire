import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Trashbin } from "@/lib/types";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/utils";

const green = "#4ade80";
const red = "#f87171";

const chartConfig = {
  active: {
    label: "Active",
    color: green,
  },
  inactive: {
    label: "Inactive",
    color: red,
  },
} satisfies ChartConfig;

function groupTrashbinData(trashbins: Trashbin[]) {
  const dateMap = new Map<string, { active: number; inactive: number }>();

  const now = new Date();
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(now.getMonth() - 5);

  for (const bin of trashbins) {
    const createdAt =
      typeof bin.createdAt === "string"
        ? new Date(bin.createdAt)
        : bin.createdAt;

    if (createdAt < fiveMonthsAgo) continue;

    const date = createdAt.toISOString().split("T")[0];

    if (!dateMap.has(date)) {
      dateMap.set(date, { active: 0, inactive: 0 });
    }

    const group = dateMap.get(date)!;
    if (bin.isActive) {
      group.active += 1;
    } else {
      group.inactive += 1;
    }
  }

  return Array.from(dateMap.entries())
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function TrashbinActivesLevels({
  trashbins,
}: {
  trashbins: Trashbin[];
}) {
  const chartData = React.useMemo(
    () => groupTrashbinData(trashbins),
    [trashbins],
  );

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("active");

  const total = React.useMemo(
    () =>
      chartData.reduce(
        (acc, curr) => {
          acc.active += curr.active;
          acc.inactive += curr.inactive;
          return acc;
        },
        { active: 0, inactive: 0 },
      ),
    [chartData],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Trashbin Activity</CardTitle>
          <CardDescription>
            Operational and Non-operational Trashbins
          </CardDescription>
        </div>
        <div className="flex">
          {["active", "inactive"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
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
          className="aspect-auto h-[175px] w-full"
        >
          <BarChart
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
                  className="w-[200px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <Button
        variant="ghost"
        className="w-fit ml-auto mr-[1rem] mb-[-0.7rem]"
        onClick={() => downloadCSV(trashbins, "trashbin-actives-analytics.csv")}
      >
        Export
        <Download />
      </Button>
    </Card>
  );
}
