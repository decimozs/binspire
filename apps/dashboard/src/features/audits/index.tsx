import type { Audit } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { ShieldQuestionMark } from "lucide-react";
import RefreshButton from "@/components/core/refresh-button";
import MainLayout from "@/components/layout/main-layout";
import RequestAccess from "@/features/permissions/components/request-access";
import { usePermissionStore } from "@/store/permission-store";
import AuditDataTable from "./components/data-table";

interface AuditsProps {
  data: Audit[];
}

export default function Audits({ data }: AuditsProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldQuestionMark />
            </EmptyMedia>
            <EmptyTitle>No audit records</EmptyTitle>
            <EmptyDescription>
              There are currently no audit logs available. Activity records will
              appear here once system events are logged.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RefreshButton queryKey="audits" />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.activityManagement?.actions} />
      <MainLayout
        title="Audits"
        description="Manage and review audit records for compliance and security."
      >
        <AuditDataTable data={data} />
      </MainLayout>
    </>
  );
}
