import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrashbinCollection, TrashbinIssue } from "@/lib/types";
import { downloadCSV, formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { Download, Sheet } from "lucide-react";

const chartConfig = {
  collections: {
    label: "Collections",
    color: "hsl(142.1, 76.2%, 36.3%)", // This is the hex equivalent of green-400
  },
  issues: {
    label: "Issues",
    color: "hsl(0, 84.2%, 60.2%)", // This is the hex equivalent of red-400
  },
} satisfies ChartConfig;

export default function CollectionLevels({
  collections,
  issues,
}: {
  collections: TrashbinCollection;
  issues: TrashbinIssue;
}) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const collectionsCountByDate = React.useMemo(() => {
    const counts = new Map<string, number>();
    collections.forEach(({ createdAt }) => {
      const dateStr = formatDate(createdAt);
      counts.set(dateStr, (counts.get(dateStr) ?? 0) + 1);
    });
    return counts;
  }, [collections]);

  // Group issues by day and count
  const issuesCountByDate = React.useMemo(() => {
    const counts = new Map<string, number>();
    issues.forEach(({ createdAt }) => {
      const dateStr = formatDate(createdAt);
      counts.set(dateStr, (counts.get(dateStr) ?? 0) + 1);
    });
    return counts;
  }, [issues]);

  // Get all unique dates from collections and issues
  const allDatesSet = new Set<string>([
    ...collectionsCountByDate.keys(),
    ...issuesCountByDate.keys(),
  ]);
  const allDates = Array.from(allDatesSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  // Filter dates based on time range
  const filteredDates = React.useMemo(() => {
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return allDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startDate;
    });
  }, [allDates, timeRange]);

  // Build chart data array
  const filteredData = filteredDates.map((date) => ({
    date,
    collections: collectionsCountByDate.get(date) ?? 0,
    issues: issuesCountByDate.get(date) ?? 0,
  }));
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Trashbins Events</CardTitle>
          <CardDescription>
            Showing collections and issues for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onClick={() => downloadCSV(filteredData, "trashbin-analytics.csv")}
        >
          Export
          <Download />
        </Button>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCollections" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-collections)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-collections)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIssues" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-issues)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-issues)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="issues"
              type="natural"
              fill="url(#fillIssues)"
              stroke="var(--color-issues)"
              stackId="a"
            />
            <Area
              dataKey="collections"
              type="natural"
              fill="url(#fillCollections)"
              stroke="var(--color-collections)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
