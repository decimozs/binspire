import {
  useCollectionStore,
  setAssignCollector,
  resetAllCollectors,
  resetAssignCollector,
} from "@/store/collection-store";
import {
  useGetAllUsers,
  useGetAllTrashbins,
  useQueryClient,
  type User,
  useCreateUserCollectionAssignment,
  useGetAllUserCollectionAssignment,
} from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@binspire/ui/components/accordion";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { useMemo } from "react";
import { useTrashbinMap } from "@/hooks/use-trashbin-map";
import { ShowToast } from "@/components/core/toast-notification";
import { CalendarPlus, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { usePermissionStore } from "@/store/permission-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";

export default function AvailableCollectors() {
  const { permission } = usePermissionStore();
  const {
    collectorsOpen,
    handleCloseAvailableCollectors,
    viewFromMap,
    handleClose,
    handleOpenAvailableCollectors,
  } = useTrashbinMap();
  const trashbinId = viewFromMap?.id as string;
  const { data: users, isPending } = useGetAllUsers();
  const { data: trashbins } = useGetAllTrashbins();
  const { data: userAssignCollections } = useGetAllUserCollectionAssignment();
  const queryClient = useQueryClient();
  const createCollectionAssignment = useCreateUserCollectionAssignment();
  const assignCollector = useCollectionStore((state) => state.assignCollector);

  const assigned = useMemo(
    () => assignCollector.find((a) => a.trashbinId === trashbinId),
    [assignCollector, trashbinId],
  );

  const collectors = assigned?.collectors || [];

  if (!users || isPending) return null;

  const maintenanceUsers = users.filter(
    (user) =>
      user.status.role === "maintenance" &&
      (user.assignCollections?.length ?? 0) < 3,
  );

  const getTrashbinAssignmentsCount = (trashbinId: string) => {
    return (
      userAssignCollections?.filter((u) => u.trashbinId === trashbinId)
        .length || 0
    );
  };

  const handleAssign = (user: User) => {
    setAssignCollector(trashbinId, {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image || "",
    });
  };

  const handleAssignTrashbin = (user: User, trashbinId: string) => {
    setAssignCollector(trashbinId, {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image || "",
    });
  };

  const trashbinAssignedCount = (trashbinId: string) => {
    return (
      assignCollector.find((a) => a.trashbinId === trashbinId)?.collectors
        .length || 0
    );
  };

  const handleRefresh = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  const hasReachedLimit = collectors.length >= 3;

  const handleCreateCollectionAssignment = async () => {
    await Promise.all(
      assignCollector.flatMap((c) =>
        c.collectors.map((u) =>
          createCollectionAssignment.mutateAsync({
            trashbinId: c.trashbinId,
            userId: u.id,
          }),
        ),
      ),
    );

    resetAssignCollector();
    handleClose();
    ShowToast("success", "Collectors assigned successfully");
  };

  const hasPermission = permission.mapManagement?.actions.create;

  if (!hasPermission) return null;

  return (
    <Sheet
      open={collectorsOpen}
      onOpenChange={(open) => {
        if (!open) handleCloseAvailableCollectors();
      }}
      modal={false}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenAvailableCollectors}
            >
              <CalendarPlus />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="font-bold">Available Collectors</p>
        </TooltipContent>
      </Tooltip>
      <SheetContent
        className="min-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Available Collectors</SheetTitle>
          <SheetDescription>
            Select a collector to assign to this trashbin.
          </SheetDescription>
        </SheetHeader>

        {maintenanceUsers.length === 0 ? (
          <div className="text-sm text-muted-foreground px-4 flex flex-row items-center justify-between -mt-5">
            <p>No maintenance users available.</p>
            <p>Refresh</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground px-4 flex flex-row items-center justify-between -mt-5">
            <p>
              <span className="text-primary font-bold">
                {maintenanceUsers.length}
              </span>{" "}
              available collectors
            </p>
            <p
              className="cursor-pointer hover:underline"
              onClick={handleRefresh}
            >
              Refresh
            </p>
          </div>
        )}

        <ScrollArea className="px-4 overflow-y-hidden">
          <div className="flex flex-col gap-4">
            {maintenanceUsers.map((user) => {
              const assignedEntry = assignCollector.find((a) =>
                a.collectors.some((c) => c.id === user.id),
              );
              const alreadyAssigned = Boolean(assignedEntry);

              const assignedTrashbinName = trashbins?.find(
                (t) => t.id === assignedEntry?.trashbinId,
              )?.name;

              return (
                <div key={user.id} className="px-4 border rounded-md">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${user.id}`}>
                      <AccordionTrigger
                        className="hover:no-underline"
                        disabled={alreadyAssigned}
                      >
                        <div>
                          <div
                            className={
                              alreadyAssigned
                                ? "flex flex-row items-center gap-2"
                                : ""
                            }
                          >
                            <p className="font-medium">{user.name}</p>
                            {alreadyAssigned && (
                              <p className="text-xs blue-badge">
                                Assigned to{" "}
                                <span className="font-medium">
                                  {assignedTrashbinName ||
                                    assignedEntry?.trashbinId}
                                </span>
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-end w-full">
                          {viewFromMap.type !== "trashbin" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  disabled={hasReachedLimit || alreadyAssigned}
                                >
                                  {alreadyAssigned
                                    ? "Already Assigned"
                                    : "Assign"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="left"
                                align="start"
                                className="w-[200px]"
                              >
                                <DropdownMenuLabel>Trashbins</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {trashbins?.map((item) => (
                                  <DropdownMenuItem
                                    key={item.id}
                                    onClick={() =>
                                      handleAssignTrashbin(user, item.id)
                                    }
                                    disabled={
                                      getTrashbinAssignmentsCount(item.id) +
                                        trashbinAssignedCount(item.id) >=
                                      3
                                    }
                                  >
                                    <div className="flex flex-row items-center justify-between w-full">
                                      <p>{item.name}</p>
                                      <p className="text-sm font-medium">
                                        {getTrashbinAssignmentsCount(item.id) +
                                          trashbinAssignedCount(item.id)}{" "}
                                        / 3
                                      </p>
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAssign(user)}
                              disabled={hasReachedLimit || alreadyAssigned}
                            >
                              {alreadyAssigned ? "Already Assigned" : "Assign"}
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <SheetFooter>
          <div
            className={`w-full ${viewFromMap.type === "trashbin" ? "" : "grid grid-cols-2 gap-2"}`}
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={resetAllCollectors}
              disabled={assignCollector.length === 0}
            >
              Clear Assignment
            </Button>
            {viewFromMap.type !== "trashbin" && (
              <Button
                size="lg"
                disabled={
                  assignCollector.length < 1 ||
                  createCollectionAssignment.isPending
                }
                onClick={handleCreateCollectionAssignment}
              >
                {createCollectionAssignment.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Assign Collectors"
                )}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
