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
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "@binspire/ui/components/chart";

interface Props<T> {
  title: string;
  description: string;
  dataDescription: string;
  dataName: string;
  data: T[];
  filterFn?: (item: T) => boolean;
  valueFn?: (filteredData: T[]) => number;
}

export default function FilteredChart<T>({
  title,
  description,
  dataDescription,
  dataName,
  data,
  filterFn,
  valueFn,
}: Props<T>) {
  const filtered = filterFn ? data.filter(filterFn) : data;
  const value = valueFn ? valueFn(filtered) : filtered.length;

  const chartData = [{ name: dataName, value, fill: "var(--color-primary)" }];

  const chartConfig: ChartConfig = {
    value: { label: dataName },
    [dataName]: {
      label: dataName,
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {Number(value.toFixed(1)).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {dataName}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          {dataDescription}
        </div>
      </CardFooter>
    </Card>
  );
}
