import type { UserInvitation } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Mail } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import InviteUserButton from "../data-table/components/invite-user-button";
import RequestAccess from "../permissions/components/request-access";
import UserInvitationsDataTable from "./components/data-table";

interface UserInvitationProps {
  data: UserInvitation[];
}

export default function UserInvitation({ data }: UserInvitationProps) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Mail />
            </EmptyMedia>
            <EmptyTitle>No invitations</EmptyTitle>
            <EmptyDescription>
              There are currently no active or pending invitations. New
              invitations will appear here once sent.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InviteUserButton />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.invitationsManagement?.actions} />
      <MainLayout
        title="Invitation"
        description="Manage user invitations and their statuses within the application."
      >
        <UserInvitationsDataTable data={data} />
      </MainLayout>
    </>
  );
}
