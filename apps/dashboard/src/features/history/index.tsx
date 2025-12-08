import type { History } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { History as HistoryIcon } from "lucide-react";
import RefreshButton from "@/components/core/refresh-button";
import MainLayout from "@/components/layout/main-layout";
import RequestAccess from "@/features/permissions/components/request-access";
import { usePermissionStore } from "@/store/permission-store";
import HistoryDataTable from "./components/data-table";

interface HistoryProps {
  data: History[];
}

export default function History({ data }: HistoryProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HistoryIcon />
            </EmptyMedia>
            <EmptyTitle>No history available</EmptyTitle>
            <EmptyDescription>
              There are no past records to display. Your activity history will
              appear here once actions are completed.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RefreshButton queryKey="histories" />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.historyManagement?.actions} />
      <MainLayout
        title="Histories"
        description="Review and manage historical records effectively."
      >
        <HistoryDataTable data={data} />
      </MainLayout>
    </>
  );
}
