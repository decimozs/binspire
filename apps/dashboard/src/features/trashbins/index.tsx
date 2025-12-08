import type { Trashbin } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Trash } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import RequestAccess from "../permissions/components/request-access";
import TrashbinsDataTable from "./components/data-table";
import RegisterTrashbin from "./components/register-trashbin";

interface TrashbinsProps {
  data: Trashbin[];
}

export default function Trashbins({ data }: TrashbinsProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader className="min-w-[500px]">
            <EmptyMedia variant="icon">
              <Trash />
            </EmptyMedia>
            <EmptyTitle>No trashbins available</EmptyTitle>
            <EmptyDescription>
              There are currently no registered trashbins. Add a new trashbin to
              start managing waste collection and assignments.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RegisterTrashbin />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.trashbinManagement?.actions} />
      <MainLayout
        title="Trashbin"
        description="Monitor and manage your community trash bins efficiently."
      >
        <TrashbinsDataTable data={data} />
      </MainLayout>
    </>
  );
}
