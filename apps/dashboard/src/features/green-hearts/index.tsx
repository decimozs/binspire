import type { UserGreenHeart } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { HeartHandshake } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import RequestAccess from "../permissions/components/request-access";
import CreateGreenHearts from "./components/create-green-hearts";
import GreenHeartsDataTable from "./components/data-table";

export default function GreenHearts({ data }: { data: UserGreenHeart[] }) {
  const { permission } = usePermissionStore();

  if (data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HeartHandshake />
            </EmptyMedia>
            <EmptyTitle>No green hearts found</EmptyTitle>
            <EmptyDescription>
              There are currently no green hearts associated with users.
              Encourage users to earn green hearts through positive actions and
              contributions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateGreenHearts />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.greenHeartsManagement?.actions} />
      <MainLayout
        title="Green Hearts"
        description="Manage and review user green heart data."
      >
        <GreenHeartsDataTable data={data} />
      </MainLayout>
    </>
  );
}
