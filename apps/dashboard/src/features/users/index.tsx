import MainLayout from "@/components/layout/main-layout";
import UsersDataTable from "./components/data-table";
import { usePermissionStore } from "@/store/permission-store";
import RequestAccess from "../permissions/components/request-access";
import type { User } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import InviteUserButton from "../data-table/components/invite-user-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { getInitial } from "@binspire/shared";

interface UsersProps {
  data: User[];
}

export default function Users({ data }: UsersProps) {
  const { permission } = usePermissionStore();

  if (data.length === 1 || data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                <Avatar>
                  <AvatarImage
                    src={data[0]?.image || ""}
                    alt={`@${data[0]?.name}`}
                  />
                  <AvatarFallback>
                    {getInitial(data[0].name || "")}
                  </AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/u1.png" alt="@u1" className="bg-accent" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/u2.png" alt="@u2" className="bg-accent" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
              </div>
            </EmptyMedia>
            <EmptyTitle>No team members</EmptyTitle>
            <EmptyDescription>
              There are currently no users in your team. Invite members to
              collaborate and manage operations together.
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
      <RequestAccess actions={permission.userManagement?.actions} />
      <MainLayout
        title="Users"
        description="Manage user accounts and permissions within the application."
      >
        <UsersDataTable data={data} />
      </MainLayout>
    </>
  );
}
