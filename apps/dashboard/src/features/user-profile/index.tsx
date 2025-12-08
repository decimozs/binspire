import type { User } from "@binspire/query";
import { Separator } from "@binspire/ui/components/separator";
import { Outlet } from "@tanstack/react-router";
import MainLayout from "@/components/layout/main-layout";
import { authClient } from "@/lib/auth-client";
import RecentActivityTabs from "./components/recent-activity-tabs";
import UserDetails from "./components/user-details";

interface Props {
  data: User;
}

export default function UserProfile({ data }: Props) {
  const { data: currentSession } = authClient.useSession();
  const isCurrentUser = currentSession?.user.id === data.id;

  return (
    <MainLayout
      title={isCurrentUser ? "Profile" : `User #${data.no}`}
      description="Review and manage user profile information."
    >
      <div className="flex flex-col gap-6">
        <UserDetails data={data} />
        <Separator />
        <RecentActivityTabs data={data} />
        <Outlet />
      </div>
    </MainLayout>
  );
}
