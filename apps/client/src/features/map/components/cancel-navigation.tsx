import { ShowToast } from "@/components/toast";
import { useSession } from "@/features/auth";
import { useRouteStore } from "@/store/route-store";
import { useGetOrganizationSettingsById } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { Loader2, RouteOff } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

export default function CancelNavigation() {
  const { deleteRoute } = useRouteStore();
  const session = useSession();
  const { data: settings } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );
  const [, setMarkTrashbinQuery] = useQueryState("mark_trashbin_id");
  const currentSettings = settings?.settings;
  const [isLoading, setIsLoading] = useState(false);

  const handleResetMapState = async () => {
    try {
      setIsLoading(true);

      if (currentSettings?.general?.location) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        deleteRoute();
        setMarkTrashbinQuery(null);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        ShowToast("info", "Cleaning up navigation session...");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive" className="z-50">
          <RouteOff />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This will end your current navigation session.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            onClick={handleResetMapState}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
