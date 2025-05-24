import * as React from "react";
import { Download, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Role } from "@/lib/types";
import { Button } from "../ui/button";
import { downloadCSV } from "@/lib/utils";

type User = {
  image: string | null;
  id: string;
  name: string;
  role: string;
  email: string;
  emailVerified: boolean;
  permission: string;
  createdAt: Date;
  updatedAt: Date;
  orgId: string | null;
  isOnline: boolean;
};

export function ActiveUsersLevels({
  users,
  role,
}: {
  users: User[];
  role: Role;
}) {
  const chartData = React.useMemo(() => {
    const roleCounts: Record<string, number> = {};
    users
      .filter((user) => user.isOnline && user.role === role)
      .forEach((user) => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });

    const green = "#4ade80";
    const blue = "#60a5fa";

    const colors: Record<string, string> = {
      admin: blue,
      collector: green,
      user: green,
      other: green,
    };

    return Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
      fill: colors[role] || "hsl(var(--chart-5))",
    }));
  }, [users]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach(({ role, fill }) => {
      config[role] = {
        label: role.charAt(0).toUpperCase() + role.slice(1),
        color: fill,
      };
    });
    config["count"] = { label: "Users" };
    return config;
  }, [chartData]);

  const totalActive = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          {role === "admin" ? "Active Admins" : "Active Collectors"}
        </CardTitle>
        <CardDescription>Currently online</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="role"
              innerRadius={60}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalActive}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Online
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Live user monitoring <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {`Showing active ${role === "admin" ? "admins" : "collectors"}`}
        </div>
        <Button
          variant="ghost"
          className="mb-[-0.7rem]"
          onClick={() => downloadCSV(users, `active-${role}-analytics.csv`)}
        >
          Export
          <Download />
        </Button>
      </CardFooter>
    </Card>
  );
}
