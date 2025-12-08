import type { UserRequest } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Key } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import RequestAccess from "../permissions/components/request-access";
import UserRequestsDataTable from "./components/data-table";
import RequestButton from "./components/request-button";

interface UserRequestProps {
  data: UserRequest[];
}

export default function UserRequest({ data }: UserRequestProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Key />
            </EmptyMedia>
            <EmptyTitle>No user requests</EmptyTitle>
            <EmptyDescription>
              There are currently no pending or submitted requests. New user
              requests will appear here once created.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RequestButton />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.accessRequestsManagement?.actions} />
      <MainLayout
        title="Requests"
        description="Manage user requests and their statuses within the application."
      >
        <UserRequestsDataTable data={data} />
      </MainLayout>
    </>
  );
}
