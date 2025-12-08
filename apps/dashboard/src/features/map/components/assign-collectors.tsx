import { useGetTrashbinById } from "@binspire/query";
import { getInitial } from "@binspire/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Trash } from "lucide-react";
import { useMemo } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import { useCollectionStore } from "@/store/collection-store";

export default function AssignCollectors({
  trashbinId,
}: {
  trashbinId: string;
}) {
  const assignCollector = useCollectionStore((state) => state.assignCollector);
  const { data, isPending } = useGetTrashbinById(trashbinId);

  const assigned = useMemo(
    () => assignCollector.find((a) => a.trashbinId === trashbinId),
    [assignCollector, trashbinId],
  );

  const collectors = assigned?.collectors || [];

  if (!data || isPending) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Collection</DialogTitle>
          <DialogDescription>
            Assign collectors responsible for handling this trashbin’s
            collection schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center mt-4">
          <ArcherContainer
            strokeColor="gray"
            lineStyle="angle"
            endMarker={true}
          >
            <div className="flex items-center justify-center">
              <ArcherElement id="root">
                <div className="border-dashed border-accent rounded-md p-4 border-[1px] w-fit flex items-center justify-center flex-col gap-3">
                  <Trash />
                  <div className="text-xs">
                    <p>{data.name}</p>
                  </div>
                </div>
              </ArcherElement>
            </div>
            <div className="flex flex-row justify-evenly w-full gap-12">
              {collectors.map((collector, idx) => (
                <ArcherElement
                  id={`elememt${idx}`}
                  key={collector.id}
                  relations={[
                    {
                      targetId: "root",
                      targetAnchor: "bottom",
                      sourceAnchor: "top",
                      style: { strokeDasharray: "5,5" },
                    },
                  ]}
                >
                  <div className="border-dashed border-accent rounded-md p-4 border-[1px] w-fit mt-20 flex items-center justify-center flex-col gap-3">
                    <Avatar className="size-15">
                      <AvatarImage src={collector.image || ""} />
                      <AvatarFallback>
                        {getInitial(collector.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </ArcherElement>
              ))}
            </div>
          </ArcherContainer>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </DialogClose>
          <Button size="lg">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
