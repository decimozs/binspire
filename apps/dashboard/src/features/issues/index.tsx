import IssuesDataTable from "./components/data-table";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import RequestAccess from "../permissions/components/request-access";
import type { Issue } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import CreateIssueButton from "./components/create-issue-button";
import { Info } from "lucide-react";

interface IssuesProps {
  data: Issue[];
}

export default function Issues({ data }: IssuesProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Info />
            </EmptyMedia>
            <EmptyTitle>No issues found</EmptyTitle>
            <EmptyDescription>
              There are currently no reported issues. New issues will appear
              here once created.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateIssueButton />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.issueManagement?.actions} />
      <MainLayout
        title="Issues"
        description="Track and manage community issues effectively."
      >
        <IssuesDataTable data={data} />
      </MainLayout>
    </>
  );
}
