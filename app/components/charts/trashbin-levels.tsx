import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { TrashbinStatus } from "@/lib/types";
import { trashbinStatusColorMap } from "@/lib/constants";

const chartConfig = {
  level: {
    label: "Level",
  },
} satisfies ChartConfig;

export interface TrashbinLevelProps {
  chartName: string;
  level: number;
  status: TrashbinStatus;
}

export function TrashbinLevels({
  chartName,
  level,
  status,
}: TrashbinLevelProps) {
  const chartData = [
    {
      name: chartName,
      level,
      fill: trashbinStatusColorMap[status],
    },
  ];

  const startAngle = 90;
  const endAngle = startAngle + (level / 100) * 360;

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={80}
          outerRadius={110}
          barCategoryGap={2}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            polarRadius={[86, 74]}
            className="first:fill-muted last:fill-background"
          />
          <RadialBar dataKey="level" background cornerRadius={10} />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            tickLine={false}
            axisLine={false}
          >
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
                        {level}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        {chartName}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 flex-row">
          <span
            className="w-[10px] h-[10px]  block"
            style={{ backgroundColor: trashbinStatusColorMap[status] }}
          ></span>
          <p className="text-sm capitalize">
            {typeof status === "string" ? status.replace("-", " ") : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
