import { ShowToast } from "@/components/core/toast-notification";
import { useMqtt } from "@/hooks/use-mqtt";
import {
  useUpdateUserRequest,
  useUpdateUserStatus,
  type UserStatus,
} from "@binspire/query";
import {
  formatLabel,
  type ModuleActions,
  type PermissionModuleKeys,
} from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Switch } from "@binspire/ui/components/switch";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type PermissionEntry = {
  actions: Record<keyof ModuleActions, boolean>;
};

type PermissionModules = Record<PermissionModuleKeys, PermissionEntry>;

export default function UpdateOptions({
  data,
  requestId,
}: {
  data: UserStatus;
  requestId: string;
}) {
  const [open, setOpen] = useState(false);
  const { client } = useMqtt();
  const updateUserPermission = useUpdateUserStatus();
  const updateUserRequest = useUpdateUserRequest();
  const [permissions, setPermissions] = useState<PermissionModules>(
    (data.permission as PermissionModules) ?? ({} as PermissionModules),
  );

  const [selectedManagement, setSelectedManagement] =
    useState<PermissionModuleKeys | null>("mapManagement");

  const permissionManagements = { ...permissions };
  const managementKeys = Object.keys(
    permissionManagements,
  ) as PermissionModuleKeys[];

  const togglePermission = (
    module: PermissionModuleKeys,
    action: keyof ModuleActions,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        actions: {
          ...prev[module].actions,
          [action]: !prev[module].actions[action],
        },
      },
    }));
  };

  const handleUpdatePermissions = async () => {
    if (!data.userId) return;

    await updateUserPermission.mutateAsync({
      userId: data.userId,
      data: { permission: permissions },
    });

    await updateUserRequest.mutateAsync({
      id: requestId,
      data: { status: "approved" },
    });

    ShowToast("success", "User permissions updated successfully");

    client?.publish(
      "user/permissions/update",
      JSON.stringify({
        requestId,
        userId: data.userId,
      }),
    );

    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <p className="text-muted-foreground">Options</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Update user permissions
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[900px]">
            <DialogHeader>
              <DialogTitle>Update User Permissions</DialogTitle>
              <DialogDescription>
                Adjust the selected user's access levels. These changes will
                take effect immediately and may impact what features or data the
                user can access.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-[240px_1fr] gap-4">
              <div className="flex flex-col gap-2">
                <p>Managements</p>
                {managementKeys.map((key) => (
                  <Button
                    key={key}
                    variant={selectedManagement === key ? "default" : "outline"}
                    size="sm"
                    className="w-full flex items-center justify-start"
                    onClick={() => setSelectedManagement(key)}
                  >
                    <p className="text-left">{formatLabel(key)}</p>
                  </Button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <p>Current Permissions</p>
                {selectedManagement && (
                  <div className="border border-muted border-dashed rounded-md px-4 py-2">
                    {Object.entries(
                      permissions?.[selectedManagement]?.actions ?? {},
                    ).map(([action, allowed]) => (
                      <div
                        key={action}
                        className="flex items-center justify-between py-1"
                      >
                        <p className="capitalize">{action}</p>
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {allowed ? "On" : "Off"}
                          </p>
                          <Switch
                            checked={allowed}
                            onCheckedChange={() =>
                              togglePermission(
                                selectedManagement,
                                action as keyof ModuleActions,
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleUpdatePermissions}
                    disabled={updateUserPermission.isPending}
                  >
                    {updateUserPermission.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Update Permission"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
