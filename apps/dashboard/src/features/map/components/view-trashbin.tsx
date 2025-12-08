import {
  useCreateUserCollectionAssignment,
  useGetTrashbinById,
} from "@binspire/query";
import { UserColumn } from "@binspire/ui/badges";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@binspire/ui/components/dialog";
import { Separator } from "@binspire/ui/components/separator";
import { Loader2 } from "lucide-react";
import CopyToClipboardButton from "@/components/core/copy-clipboard";
import ShowQrCode from "@/components/core/show-qr-code";
import { ShowToast } from "@/components/core/toast-notification";
import TrashbinDetails from "@/features/trashbins/components/trashbin-details";
import { useTrashbinMap } from "@/hooks/use-trashbin-map";
import {
  removeAssignCollector,
  resetTrashbinCollectors,
  useCollectionStore,
} from "@/store/collection-store";
import { usePermissionStore } from "@/store/permission-store";

export default function ViewTrashbin() {
  const { permission } = usePermissionStore();
  const { open, handleClose, viewFromMap, handleOpenAvailableCollectors } =
    useTrashbinMap();
  const trashbinId = viewFromMap?.id;
  const { data, isPending } = useGetTrashbinById(trashbinId!);
  const createCollectionAssignment = useCreateUserCollectionAssignment();

  const assignCollector = useCollectionStore((state) =>
    state.assignCollector.find((a) => a.trashbinId === trashbinId),
  );

  if (!data || isPending) return null;

  const collectors = assignCollector?.collectors || [];
  const isAssigning = collectors.length > 0;
  const hasReachedLimit = collectors.length >= 3;

  const handleCreateCollectionAssignment = async () => {
    await Promise.all(
      collectors.map((c) =>
        createCollectionAssignment.mutateAsync({
          trashbinId: trashbinId!,
          userId: c.id,
        }),
      ),
    );

    resetTrashbinCollectors(trashbinId!);
    handleClose();
    ShowToast("success", "Collectors assigned successfully");
  };

  const hasPermission = permission.mapManagement?.actions.create;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()} modal={false}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Viewing Trashbin</DialogTitle>
          <DialogDescription>
            {trashbinId
              ? `Currently viewing trashbin ID: ${trashbinId}`
              : "No trashbin selected."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col text-sm">
              <p>Id</p>
              <p className="text-muted-foreground">{data.id}</p>
            </div>
            <div className="flex flex-row gap-2">
              <CopyToClipboardButton text={data.id} />
              <ShowQrCode id={data.id} />
            </div>
          </div>

          <Separator />

          <TrashbinDetails data={data} />

          {hasPermission && <Separator />}

          {collectors.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4">
                  <p className="text-sm">Assign Collector</p>
                  <p className="text-sm">
                    <span className="text-primary">{collectors.length}</span> /
                    3
                  </p>
                </div>
                {collectors.length >= 2 && (
                  <p
                    className="text-sm cursor-pointer hover:underline"
                    onClick={() => resetTrashbinCollectors(trashbinId!)}
                  >
                    Clear all
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {collectors.map((user) => (
                  <div
                    key={user.id}
                    className="border border-dashed rounded-md px-4 py-2 flex flex-row justify-between items-center"
                  >
                    <UserColumn
                      name={user.name}
                      imageUrl={user.image || ""}
                      email={user.email}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        removeAssignCollector(trashbinId!, user.id)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasPermission && (
            <>
              {isAssigning ? (
                <Button
                  size="lg"
                  disabled={isAssigning}
                  variant="outline"
                  className={hasReachedLimit ? "hidden" : "-mb-4"}
                  onClick={handleOpenAvailableCollectors}
                >
                  Looking for collector...
                </Button>
              ) : (
                <Button size="lg" onClick={handleOpenAvailableCollectors}>
                  Assign Collector
                </Button>
              )}

              {isAssigning && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCreateCollectionAssignment}
                  disabled={createCollectionAssignment.isPending}
                >
                  {createCollectionAssignment.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Assign"
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
