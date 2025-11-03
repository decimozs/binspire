import { ShowToast } from "@/components/core/toast-notification";
import { usePermissionStore } from "@/store/permission-store";
import { useUpdateUserStatus, type UserStatus } from "@binspire/query";
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
import { Key, Loader2 } from "lucide-react";
import { useState } from "react";

type PermissionEntry = {
  actions: Record<keyof ModuleActions, boolean>;
};

type PermissionModules = Record<PermissionModuleKeys, PermissionEntry>;

export default function ViewACL({ data }: { data: UserStatus }) {
  const { permission } = usePermissionStore();
  const updateUserPermission = useUpdateUserStatus();
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

    ShowToast("success", "User permissions updated successfully");
  };

  const hasPermission = permission.accessRequestsManagement?.actions.update;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mr-auto">
          <Key />
          Access Control List
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[900px]">
        <DialogHeader>
          <DialogTitle>Access Control List</DialogTitle>
          <DialogDescription>
            View the detailed access control list (ACL) for this user.
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
                        disabled={!hasPermission}
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
            {hasPermission && (
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
