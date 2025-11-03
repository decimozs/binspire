import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
} from "@binspire/ui/components/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@binspire/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@binspire/ui/components/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import ChartExportButton from "./chart-export-buttont";
import { useQueryState } from "nuqs";

interface Props<T extends { createdAt: string | Date }> {
  title: string;
  description: string;
  data: T[];
}

const chartConfig = {
  count: {
    label: "Entries",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type RangeOption = "3m" | "6m" | "1y" | "all";

export default function OverviewDataChart<
  T extends { createdAt: string | Date },
>({ title, description, data }: Props<T>) {
  const [range, setRange] = useQueryState<RangeOption>("range", {
    defaultValue: "all",
    parse: (val) =>
      ["3m", "6m", "1y", "all"].includes(val) ? (val as RangeOption) : "all",
    serialize: (val) => val,
  });

  const monthlyData = data.reduce<Record<string, number>>((acc, item) => {
    const createdAt =
      typeof item.createdAt === "string"
        ? new Date(item.createdAt)
        : item.createdAt;

    const key = `${createdAt.getFullYear()}-${String(
      createdAt.getMonth() + 1,
    ).padStart(2, "0")}`;

    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData)
    .map(([key, count]) => {
      const [year, month] = key.split("-");
      const date = new Date(Number(year), Number(month) - 1);

      return {
        month: date.toLocaleString("default", { month: "long" }),
        year,
        count,
        sortKey: date.getTime(),
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  function filterByRange(data: typeof chartData, range: RangeOption) {
    if (range === "all") return data;

    const now = new Date();
    let cutoff: Date;

    switch (range) {
      case "3m":
        cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "6m":
        cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case "1y":
        cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return data;
    }

    return data.filter((item) => item.sortKey >= cutoff.getTime());
  }

  const filteredData = filterByRange(chartData, range);

  return (
    <Card>
      <div className="flex flex-row items-center justify-between">
        <CardHeader className="w-full">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <div className="mr-6 flex flex-row items-center gap-2">
          <Select
            value={range}
            onValueChange={(val) => setRange(val as RangeOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last 1 year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
            <ChartExportButton data={filteredData} />
          </Select>
        </div>
      </div>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke={chartConfig.count.color}
              strokeWidth={2}
              dot={{ fill: "var(--color-desktop)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total entries grouped by month
        </div>
      </CardFooter>
    </Card>
  );
}
