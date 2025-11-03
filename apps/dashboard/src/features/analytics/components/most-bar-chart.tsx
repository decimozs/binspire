import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Rectangle,
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
import { useMemo } from "react";
import { formatLabel } from "@binspire/shared";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props<T extends Record<string, any>> {
  title: string;
  description?: string;
  data: T[];
  config: ChartConfig;
  dataKey: keyof T;
  nameKey: keyof T;
  footerText?: string;
  footerSubText?: string;
}

export default function MostBarChart<T extends Record<string, any>>({
  title,
  description,
  data,
  config,
  dataKey,
  nameKey,
  footerText,
  footerSubText,
}: Props<T>) {
  const activeIndex = useMemo(() => {
    if (data.length === 0) return -1;
    let maxIdx = 0;
    let maxVal = Number(data[0][dataKey]) || 0;
    data.forEach((item, idx) => {
      const val = Number(item[dataKey]) || 0;
      if (val > maxVal) {
        maxVal = val;
        maxIdx = idx;
      }
    });
    return maxIdx;
  }, [data, dataKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 20 }}
            height={100}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={nameKey as string}
              tick={false}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) => formatLabel(value)}
                />
              }
            />
            <Bar
              dataKey={dataKey as string}
              radius={8}
              activeIndex={activeIndex}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            >
              {data.map((entry, index) => {
                const key = entry[nameKey as string];
                const color = config[key]?.color ?? "var(--chart-1)";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {(footerText || footerSubText) && (
        <CardFooter className="flex-col gap-2 text-sm">
          {footerText && (
            <div className="flex items-center gap-2 leading-none font-medium">
              {footerText} <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footerSubText && (
            <div className="text-muted-foreground leading-none">
              {footerSubText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
