import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { Button } from "@binspire/ui/components/button";
import {
  Database,
  HeartHandshake,
  Pencil,
  ShieldQuestionMark,
} from "lucide-react";
import { useState } from "react";
import UserEditForm from "./edit";
import { authClient } from "@/lib/auth-client";
import MetricCard from "@/features/dashboard/components/metric-card";
import type { User } from "@binspire/query";
import { getInitial, type UserRole } from "@binspire/shared";
import { UserPermissionBadge, UserRoleBadge } from "@binspire/ui/badges";
import CopyToClipboardButton from "@/components/core/copy-clipboard";
import ChangePassword from "./change-password";
import ViewACL from "./view-acl";
import { usePermissionStore } from "@/store/permission-store";

interface Props {
  data: User;
}

export default function UserDetails({ data }: Props) {
  const { isSuperuser } = usePermissionStore();
  const { data: currentUser } = authClient.useSession();
  const isCurrentUser = currentUser?.user.id === data.id;
  const [editMode, setEditMode] = useState(false);
  const userRole = data.status.role as UserRole;

  let userContributions = 0;

  if (userRole === "admin") {
    userContributions = data.audits.length || 0;
  }

  if (userRole === "maintenance") {
    userContributions = data.collections.length || 0;
  }

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      <div className="flex flex-row gap-4">
        <div className="relative">
          <Avatar className="h-[120px] w-[120px]">
            <AvatarImage src={data.image || ""} />
            <AvatarFallback className="text-[3rem]">
              {getInitial(data.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {!editMode ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center w-full justify-between">
              <p className="font-medium text-2xl -mb-1">{data.name}</p>

              {isCurrentUser && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleEditMode}
                >
                  <Pencil />
                  Edit Profile
                </Button>
              )}
            </div>

            <p className="text-muted-foreground">{data.email}</p>
            <div className="flex flex-row items-center gap-2">
              <UserRoleBadge role={data.status.role as UserRole} />
              {isSuperuser && isCurrentUser && (
                <UserPermissionBadge permission="superuser" />
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 items-center">
                <p className="text-muted-foreground">Id: {data.id}</p>
                <CopyToClipboardButton text={data.id} />
              </div>
              <div className="flex flex-row gap-2">
                {isCurrentUser && <ChangePassword />}
                {!isSuperuser && <ViewACL data={data.status} />}
              </div>
            </div>
          </div>
        ) : (
          <UserEditForm data={data} handleCancelEdit={handleToggleEditMode} />
        )}
      </div>

      <div
        className={data.greenhearts.length > 0 ? "grid grid-cols-2 gap-2" : ""}
      >
        {userContributions > 0 && userRole === "admin" && (
          <MetricCard
            title="User Contributions"
            description="Total contributions made by the user"
            label={`+${userContributions}`}
            icon={ShieldQuestionMark}
            analyticsLink={`/audits?search=${data.name}`}
          />
        )}
        {userContributions > 0 && userRole === "maintenance" && (
          <MetricCard
            title="User Collections"
            description="Total collections made by the user"
            label={`+${userContributions}`}
            icon={Database}
            analyticsLink={`/collections?search=${data.name}`}
          />
        )}
        {data.greenhearts.length > 0 && (
          <MetricCard
            title="Green Hearts"
            description="Total donations made by the user"
            label={`+${data.greenhearts.length}`}
            icon={HeartHandshake}
            analyticsLink={`/green-hearts?search=${data.name}`}
          />
        )}
      </div>
    </div>
  );
}
