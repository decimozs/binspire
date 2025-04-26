import {
  Book,
  FilePenIcon,
  HardHat,
  Settings,
  Shield,
  ShieldUser,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { formatPermission } from "@/lib/utils";

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

const DynamicPermissionBadge = ({ permission }: { permission: string }) => {
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {permission === "editor" && <FilePenIcon size={15} className="mb-0.5" />}
      {permission === "viewer" && <Book size={15} className="mb-0.5" />}
      {permission === "full-access" && (
        <Settings size={15} className="mb-0.5" />
      )}
      <p>{formatPermission(permission)}</p>
    </div>
  );
};

const DynamicRoleBadge = ({ role }: { role: string }) => {
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {role === "admin" && <ShieldUser size={15} className="mb-0.5" />}
      {role === "collector" && <HardHat size={15} className="mb-0.5" />}
      <p>{role}</p>
    </div>
  );
};

const DynamicActionBadge = ({ action }: { action: string }) => {
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {action === "admin" && <ShieldUser size={15} className="mb-0.5" />}
      {action === "collector" && <HardHat size={15} className="mb-0.5" />}
      <p>{action}</p>
    </div>
  );
};

const DynamicActionStatusBadge = ({ status }: { status: string }) => {
  return (
    <div className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] w-fit capitalize flex flex-row gap-1 items-center">
      {status === "admin" && <ShieldUser size={15} className="mb-0.5" />}
      {status === "collector" && <HardHat size={15} className="mb-0.5" />}
      <p>{status}</p>
    </div>
  );
};

export {
  DynamicActiveBadge,
  DynamicPermissionBadge,
  DynamicActionBadge,
  DynamicRoleBadge,
  DynamicActionStatusBadge,
};
