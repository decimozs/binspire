import { ShowToast } from "@/components/toast";
import { useMqtt } from "@/context/mqtt-provider";
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
  const [markTrashbinId, setMarkTrashbinQuery] =
    useQueryState("mark_trashbin_id");
  const currentSettings = settings?.settings;
  const [isLoading, setIsLoading] = useState(false);
  const { client } = useMqtt();

  const handleResetMapState = async () => {
    try {
      setIsLoading(true);

      if (currentSettings?.general?.location) {
        if (!client) return;

        await new Promise((resolve) => setTimeout(resolve, 2000));

        client?.publish(
          `trashbin/${markTrashbinId}/tracking`,
          JSON.stringify({
            status: "stop-navigating",
          }),
        );

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
          <DrawerTitle className="text-4xl font-bold">
            Stop Navigating
          </DrawerTitle>
          <DrawerDescription>
            This will end your current navigation session.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            onClick={handleResetMapState}
            disabled={isLoading}
            variant="destructive"
            className="w-full font-bold text-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
