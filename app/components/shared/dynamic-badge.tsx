import { TrendingUp, type LucideIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatPermission } from "@/lib/utils";
import {
  actionIcons,
  permissionIcons,
  roleIcons,
  statusIcons,
} from "@/lib/constants";
import type {
  Action,
  Permission,
  Role,
  Status,
  TrashbinStatus,
} from "@/lib/types";

const DynamicActiveBadge = ({ isOnline }: { isOnline: Boolean }) => {
  return (
    <Badge
      className={`flex flex-row items-center gap-2 text-secondary-foreground ${isOnline ? "bg-green-200" : "bg-red-200"}`}
    >
      <span className="relative flex size-3">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-green-400 animate-ping" : "bg-red-400"}`}
        ></span>
        <span
          className={`relative inline-flex size-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
        ></span>
      </span>
      {isOnline ? "Active Now" : "Offline"}
    </Badge>
  );
};

const DynamicPermissionBadge = ({ permission }: { permission: Permission }) => {
  const PermissionIcons = permissionIcons[permission];
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {PermissionIcons && <PermissionIcons size={15} className="mb-0.5" />}
      <p>{formatPermission(permission)}</p>
    </div>
  );
};

const DynamicTrashbinStatusBadge = ({
  status,
  level,
}: {
  status: string;
  level: string;
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <p>{level}%</p>
      <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
        <p>{status}</p>
      </div>
      <TrendingUp size={15} />
    </div>
  );
};

const DynamicRoleBadge = ({ role }: { role: Role }) => {
  const RoleIcons: LucideIcon | undefined = roleIcons[role];
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {RoleIcons && <RoleIcons size={15} className="mb-0.5" />}
      <p>{role}</p>
    </div>
  );
};

const DynamicActionBadge = ({ action }: { action: Action }) => {
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      <p>{action === "sign-up" ? "Sign up" : action}</p>
    </div>
  );
};

const DynamicStatusBadge = ({ status }: { status: Status }) => {
  const StatusIcons: LucideIcon | undefined = statusIcons[status];

  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {StatusIcons && <StatusIcons size={15} className="mb-0.5" />}
      <p>{status}</p>
    </div>
  );
};

const DynamicActionStatusBadge = ({ action }: { action: Action }) => {
  const ActionIcons: LucideIcon | undefined = actionIcons[action as Action];

  return <>{ActionIcons && <ActionIcons className="h-6 w-6" />}</>;
};

const DynamicTrashbinOperationalBadge = ({
  isActive,
}: {
  isActive: boolean;
}) => {
  return (
    <Badge
      className={`flex flex-row items-center gap-2 text-secondary-foreground ${isActive ? "bg-green-200" : "bg-red-200"}`}
    >
      <span className="relative flex size-3">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? "bg-green-400 animate-ping" : "bg-red-400"}`}
        ></span>
        <span
          className={`relative inline-flex size-3 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
        ></span>
      </span>
      {isActive ? "Operational" : "Not Operational"}
    </Badge>
  );
};

const DynamicTrashbinIssueStatusBadge = ({ status }: { status: string }) => {
  const isFixed = status === "fixed";

  return (
    <Badge
      className={`flex flex-row items-center gap-2 text-secondary-foreground ${
        isFixed ? "bg-green-200" : "bg-red-200"
      }`}
    >
      <span className="relative flex size-3">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isFixed ? "bg-green-400 animate-ping" : "bg-red-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex size-3 rounded-full ${
            isFixed ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
      </span>
      {isFixed ? "Fix" : "Ongoing"}
    </Badge>
  );
};

export {
  DynamicActiveBadge,
  DynamicPermissionBadge,
  DynamicActionBadge,
  DynamicRoleBadge,
  DynamicStatusBadge,
  DynamicActionStatusBadge,
  DynamicTrashbinOperationalBadge,
  DynamicTrashbinStatusBadge,
  DynamicTrashbinIssueStatusBadge,
};
