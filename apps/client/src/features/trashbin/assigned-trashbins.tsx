import { useGetAllUserCollectionAssignment } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { Recycle } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { authClient } from "../auth";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useMap } from "react-map-gl/maplibre";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";

export default function AssignedTrashbins() {
  const { current: map } = useMap();
  const [open, setOpen] = useQueryState(
    "assigned_trashbins",
    parseAsBoolean.withDefault(false),
  );
  const [, setTrashbinQuery] = useQueryState("trashbin_id");
  const [, setLatQuery] = useQueryState("lat");
  const [, setLngQuery] = useQueryState("lng");
  const { data: currentSession } = authClient.useSession();
  const user = currentSession?.user;
  const { data, isPending } = useGetAllUserCollectionAssignment();
  const assignedCollections = data?.filter((i) => i.userId === user?.id);

  const handleCollectionClick = (
    trashbinId: string,
    latitude: number,
    longitude: number,
  ) => {
    if (!map) return null;

    setOpen(false);
    setTrashbinQuery(trashbinId);
    setLatQuery(latitude.toLocaleString());
    setLngQuery(longitude.toLocaleString());

    map.flyTo({
      center: [longitude, latitude],
      zoom: 18,
      padding: {
        bottom: 350,
      },
      pitch: 70,
      bearing: 10,
      essential: true,
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      <DrawerTrigger asChild>
        {isPending ? (
          <Skeleton className="h-10 w-12" />
        ) : (
          <Button
            variant="secondary"
            size="lg"
            className="relative border-[1px] border-primary h-12"
          >
            <Recycle />
            <span className="absolute -end-1 -top-1 size-5 rounded-full bg-red-500 flex items-center justify-center">
              <p className="text-xs">{assignedCollections?.length}</p>
            </span>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[50%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="text-2xl">Assigned Collections</DrawerTitle>
          <DrawerDescription>
            List of trashbins assigned for collection
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 overflow-hidden pb-4">
          {isPending ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-[92px]" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {assignedCollections &&
                assignedCollections.length > 0 &&
                assignedCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-accent/20 rounded-md p-4"
                    onClick={() =>
                      handleCollectionClick(
                        collection.trashbinId,
                        collection.trashbin.latitude!,
                        collection.trashbin.longitude!,
                      )
                    }
                  >
                    <div className="flex flex-row items-center justify-between">
                      <p className="font-semibold">
                        Collection # {collection.no}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {collection.trashbin.name}
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {formatDistanceToNow(new Date(collection.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {assignedCollections && assignedCollections.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Recycle />
                </EmptyMedia>
                <EmptyTitle>No Collection Assignments</EmptyTitle>
                <EmptyDescription>
                  You currently have no assigned trashbin collections. Once
                  assignments are available, they’ll appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
