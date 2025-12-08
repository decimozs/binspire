import { Button } from "@binspire/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Separator } from "@binspire/ui/components/separator";
import { useNavigate } from "@tanstack/react-router";
import { BarChart } from "lucide-react";
import type { ReactNode } from "react";
import RefreshButton from "@/components/core/refresh-button";
import OverviewDataChart from "./overview-data-chart";

interface Props<T extends { createdAt: Date | string }> {
  data: T[];
  title: string;
  description: string;
  renderFilteredCharts?: (data: T[]) => ReactNode;
  renderRecentChangesTable?: (data: T[]) => ReactNode;
  dataTableSource: string;
  queryKey: string;
}

export default function AnalyticsOverview<
  T extends { createdAt: Date | string },
>({
  data,
  title,
  description,
  renderFilteredCharts,
  renderRecentChangesTable,
  dataTableSource,
  queryKey,
}: Props<T>) {
  const navigate = useNavigate();

  const handleViewDataTable = () => {
    navigate({ to: dataTableSource });
  };

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[70vh] w-full">
        <Empty>
          <EmptyHeader className="min-w-[500px]">
            <EmptyMedia variant="icon">
              <BarChart />
            </EmptyMedia>
            <EmptyTitle>No analytics data available</EmptyTitle>
            <EmptyDescription>
              There’s currently no data to analyze. Analytics will appear here
              once sufficient activity or records are collected.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RefreshButton queryKey={queryKey} />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OverviewDataChart data={data} title={title} description={description} />
      <div className="grid grid-cols-3 gap-4">
        {renderFilteredCharts && renderFilteredCharts(data)}
      </div>
      <Separator />
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-semibold">Recent Changes</p>
          <p className="text-muted-foreground">View the recent changes</p>
        </div>
        <div className="mt-3 -mb-2">
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={handleViewDataTable}
          >
            View Data Table
          </Button>
        </div>
        {renderRecentChangesTable && renderRecentChangesTable(data)}
      </div>
    </div>
  );
}
