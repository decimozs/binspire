import type { TrashbinCollections } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Database } from "lucide-react";
import RefreshButton from "@/components/core/refresh-button";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import RequestAccess from "../permissions/components/request-access";
import TrashbinCollectionsDataTable from "./components/data-table";

interface TrashbinCollectionsProps {
  data: TrashbinCollections[];
}

export default function TrashbinCollections({
  data,
}: TrashbinCollectionsProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader className="min-w-[500px]">
            <EmptyMedia variant="icon">
              <Database />
            </EmptyMedia>
            <EmptyTitle>No collections available</EmptyTitle>
            <EmptyDescription>
              There are currently no trashbin collection records. New
              collections will appear here once schedules are created or
              completed.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RefreshButton queryKey="trashbin-collections" />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.collectionsManagement?.actions} />
      <MainLayout
        title="Collection"
        description="Monitor and manage your community trash bins collection efficiently."
      >
        <TrashbinCollectionsDataTable data={data} />
      </MainLayout>
    </>
  );
}
