import { TrendingUp } from "lucide-react";
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
  PieChart,
  Cell,
  Pie,
  Label,
} from "@binspire/ui/components/chart";
import { useMemo, type ReactNode } from "react";

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
  badge: ReactNode;
  level?: string;
}

export function TrashbinRadialStatus<T extends Record<string, any>>({
  title,
  description,
  data,
  config,
  dataKey,
  nameKey,
  footerText,
  footerSubText,
  level,
  badge,
}: Props<T>) {
  const total = useMemo(() => {
    return data.reduce((acc, curr) => acc + Number(curr[dataKey]), 0);
  }, [data, dataKey]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey as string}
              nameKey={nameKey as string}
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => {
                const color =
                  config[entry[nameKey] as keyof typeof config]?.color ||
                  "var(--chart-1)";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}

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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {level || total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Level
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>{" "}
          </PieChart>
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
            <div className="text-muted-foreground leading-none">{badge}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
