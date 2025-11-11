import {
  AlertOctagon,
  AlertTriangle,
  ArrowDownCircle,
  Ban,
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Eye,
  Hourglass,
  Leaf,
  Loader2,
  MinusCircle,
  Recycle,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import type {
  ActionDialogValues,
  AuditActions,
  ConfigDataValue,
  InvitationStatus,
  IssueStatus,
  ModuleActions,
  PermissionModuleKeys,
  PriorityScores,
  RequestStatus,
  UserPermission,
  UserPermissionOpts,
  UserRole,
  WasteType,
  WasteTypeData,
} from "./types";

export const TRASHBIN_CONFIG = {
  "waste-level": {
    empty: {
      style: "green-badge",
      value: 0,
      label: "Empty",
      color: "#4ade80",
    },
    low: {
      style: "green-badge",
      value: 20,
      label: "Low",
      color: "#4ade80",
    },
    "almost-full": {
      style: "yellow-badge",
      value: 50,
      label: "Almost Full",
      color: "#facc15",
    },
    full: {
      style: "orange-badge",
      value: 80,
      label: "Full",
      color: "#fb923c",
    },
    overflowing: {
      style: "red-badge",
      value: 95,
      label: "Overflowing",
      color: "#f87171",
    },
  },
  "weight-level": {
    light: {
      style: "green-badge",
      value: 0,
      label: "Light",
      color: "#4ade80",
    },
    medium: {
      style: "yellow-badge",
      value: 30,
      label: "Medium",
      color: "#facc15",
    },
    heavy: {
      style: "orange-badge",
      value: 70,
      label: "Heavy",
      color: "#fb923c",
    },
    overloaded: {
      style: "red-badge",
      value: 100,
      label: "Overloaded",
      color: "#f87171",
    },
  },
  "battery-level": {
    critical: {
      style: "red-badge",
      value: 0,
      label: "Critical",
      color: "#f87171",
    },
    low: {
      style: "orange-badge",
      value: 30,
      label: "Low",
      color: "#fb923c",
    },
    medium: {
      style: "yellow-badge",
      value: 50,
      label: "Medium",
      color: "#facc15",
    },
    full: {
      style: "green-badge",
      value: 80,
      label: "Full",
      color: "#4ade80",
    },
  },
  "solar-power": {
    none: {
      style: "red-badge",
      value: 0,
      label: "No Power",
      color: "#f87171",
    },
    low: {
      style: "orange-badge",
      value: 25,
      label: "Low",
      color: "#fb923c",
    },
    medium: {
      style: "yellow-badge",
      value: 50,
      label: "Medium",
      color: "#facc15",
    },
    high: {
      style: "green-badge",
      value: 75,
      label: "High",
      color: "#4ade80",
    },
    full: {
      style: "blue-badge",
      value: 100,
      label: "Full",
      color: "#60a5fa",
    },
  },
} as const;

export const ISSUE_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;

export const PRIORITY_SCORES = ["low", "medium", "high", "critical"] as const;

export const ENTITY_KEYS = [
  "userManagement",
  "trashbinManagement",
  "settingsManagement",
  "dashboardManagement",
  "boardManagement",
  "issueManagement",
  "activityManagement",
  "historyManagement",
  "accessRequestsManagement",
  "invitationsManagement",
  "collectionsManagement",
  "mapManagement",
  "greenHeartsManagement",
] as const satisfies PermissionModuleKeys[];

export const SYSTEM_ENTITY = [
  ...ENTITY_KEYS,
  "authentication",
  "authorization",
] as const;

export const INVITATION_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "expired",
  "confirmed",
] as const;

export const REQUEST_STATUSES = ["pending", "approved", "rejected"] as const;

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "archive",
  "restore",
  "login",
  "logout",
  "invite",
  "accept_invite",
  "reject_invite",
  "approve_request",
  "reject_request",
] as const;

export const viewerActions: ModuleActions = {
  create: false,
  read: true,
  update: false,
  delete: false,
};

export const editorActions: ModuleActions = {
  create: true,
  read: true,
  update: true,
  delete: false,
};

export const superUserActions: ModuleActions = {
  create: true,
  read: true,
  update: true,
  delete: true,
};

export const DEFAULT_PERMISSIONS: Record<string, UserPermissionOpts> = {
  viewer: {
    settingsManagement: { actions: { ...viewerActions } },
    dashboardManagement: { actions: { ...viewerActions } },
    boardManagement: { actions: { ...viewerActions } },
    issueManagement: { actions: { ...viewerActions } },
    activityManagement: { actions: { ...viewerActions } },
    historyManagement: { actions: { ...viewerActions } },
    accessRequestsManagement: { actions: { ...viewerActions } },
    invitationsManagement: { actions: { ...viewerActions } },
    collectionsManagement: { actions: { ...viewerActions } },
    mapManagement: { actions: { ...viewerActions } },
    trashbinManagement: { actions: { ...viewerActions } },
    userManagement: { actions: { ...viewerActions } },
    greenHeartsManagement: { actions: { ...viewerActions } },
  },
  editor: {
    settingsManagement: { actions: { ...viewerActions } },
    dashboardManagement: { actions: { ...editorActions } },
    boardManagement: { actions: { ...editorActions } },
    issueManagement: { actions: { ...editorActions } },
    activityManagement: { actions: { ...editorActions } },
    historyManagement: { actions: { ...editorActions } },
    accessRequestsManagement: { actions: { ...editorActions } },
    invitationsManagement: { actions: { ...editorActions } },
    collectionsManagement: { actions: { ...editorActions } },
    mapManagement: { actions: { ...editorActions } },
    trashbinManagement: { actions: { ...editorActions } },
    userManagement: { actions: { ...editorActions } },
    greenHeartsManagement: { actions: { ...editorActions } },
  },
  superuser: {
    settingsManagement: { actions: { ...superUserActions } },
    dashboardManagement: { actions: { ...superUserActions } },
    boardManagement: { actions: { ...superUserActions } },
    issueManagement: { actions: { ...superUserActions } },
    activityManagement: { actions: { ...superUserActions } },
    historyManagement: { actions: { ...superUserActions } },
    accessRequestsManagement: { actions: { ...superUserActions } },
    invitationsManagement: { actions: { ...superUserActions } },
    collectionsManagement: { actions: { ...superUserActions } },
    mapManagement: { actions: { ...superUserActions } },
    trashbinManagement: { actions: { ...superUserActions } },
    userManagement: { actions: { ...superUserActions } },
    greenHeartsManagement: { actions: { ...superUserActions } },
  },
};

export const ENTITY_DATA_VALUE = [
  { value: "userManagement", label: "User Management" },
  { value: "trashbinManagement", label: "Trashbin Management" },
  { value: "settingsManagement", label: "Settings Management" },
  { value: "dashboardManagement", label: "Dashboard Management" },
  { value: "boardManagement", label: "Board Management" },
  { value: "issueManagement", label: "Issue Management" },
  { value: "activityManagement", label: "Activity Management" },
  { value: "historyManagement", label: "History Management" },
  { value: "accessRequestsManagement", label: "Access Requests Management" },
  { value: "invitationsManagement", label: "Invitations Management" },
  { value: "collectionsManagement", label: "Collections Management" },
  { value: "mapManagement", label: "Map Management" },
  { value: "authentication", label: "Authentication" },
  { value: "authorization", label: "Authorization" },
  { value: "greenHeartsManagement", label: "Green Hearts" },
] as const;

export const ACTION_DIALOG_CONFIG: ActionDialogValues = {
  greenHeartsManagement: {
    view: {
      title: "Green Heart Information",
      description:
        "Review the details of this green heart. This section is read-only.",
    },
    delete: {
      title: "Confirm Green Heart Deletion",
      description:
        "This will permanently remove the green heart and may affect related records. Proceed with caution.",
    },
  },
  mapManagement: {
    view: {
      title: "Map Information",
      description: "Review the details of this map. This section is read-only.",
    },
    create: {
      title: "Create New Map",
      description:
        "Fill in the required details to add a new map to the system.",
    },
    update: {
      title: "Edit Map",
      description:
        "Update the map information. Changes will apply immediately.",
    },
    delete: {
      title: "Confirm Map Deletion",
      description:
        "This will permanently remove the map and may affect related records. Proceed with caution.",
    },
  },
  userManagement: {
    view: {
      title: "User Profile",
      description:
        "View full details of this user account in a read-only format.",
    },
    create: {
      title: "Create User Account",
      description:
        "Provide the necessary details to register a new user in the system.",
    },
    update: {
      title: "Update User Account",
      description:
        "Modify user information. Changes will take effect immediately.",
    },
    delete: {
      title: "Confirm User Deletion",
      description:
        "This will permanently remove the user account and revoke all access. This action cannot be undone.",
    },
  },
  boardManagement: {
    view: {
      title: "Board Information",
      description:
        "Review the details of this board. This section is read-only.",
    },
    create: {
      title: "Create Board",
      description: "Enter the required details to set up a new board.",
    },
    update: {
      title: "Edit Board",
      description:
        "Update board information. Changes will be reflected immediately.",
    },
    delete: {
      title: "Confirm Board Deletion",
      description:
        "Deleting this board will permanently remove it and all associated data.",
    },
  },
  issueManagement: {
    view: {
      title: "Issue Details",
      description: "View the details of this issue in a read-only format.",
    },
    create: {
      title: "Report New Issue",
      description: "Provide the necessary details to log a new issue.",
    },
    update: {
      title: "Update Issue",
      description: "Modify issue details. Changes will be visible immediately.",
    },
    delete: {
      title: "Confirm Issue Deletion",
      description:
        "This will permanently remove the issue record. This action cannot be undone.",
    },
  },
  historyManagement: {
    view: {
      title: "History Record",
      description: "View the details of this history log entry.",
    },
    delete: {
      title: "Confirm History Deletion",
      description:
        "This will permanently delete the selected history record. Use this action carefully.",
    },
  },
  settingsManagement: {
    view: {
      title: "System Settings",
      description:
        "View the details of current system configurations. Some settings may be read-only.",
    },
    update: {
      title: "Update Settings",
      description:
        "Modify system configuration. Changes may affect all users immediately.",
    },
  },
  trashbinManagement: {
    view: {
      title: "Trashbin Information",
      description: "View the details of this trashbin in a read-only format.",
    },
    create: {
      title: "Register New Trashbin",
      description:
        "Provide required details to add a new trashbin to the system.",
    },
    update: {
      title: "Update Trashbin",
      description:
        "Edit trashbin information. Updates will take effect immediately.",
    },
    delete: {
      title: "Confirm Trashbin Deletion",
      description:
        "This will permanently remove the trashbin and its associated records. Proceed with caution.",
    },
  },
  dashboardManagement: {
    view: {
      title: "Dashboard Information",
      description: "Review the details of this dashboard view.",
    },
    update: {
      title: "Customize Dashboard",
      description: "Modify dashboard layout or data sources.",
    },
  },
  collectionsManagement: {
    view: {
      title: "Collection Information",
      description:
        "Review the details of this collection. This section is read-only.",
    },
    create: {
      title: "Create Collection",
      description:
        "Provide details to register a new collection in the system.",
    },
    update: {
      title: "Update Collection",
      description:
        "Edit collection details. Changes will be applied immediately.",
    },
    delete: {
      title: "Confirm Collection Deletion",
      description:
        "You are about to permanently remove this collection. This action cannot be undone and may affect related records.",
    },
  },
  invitationsManagement: {
    view: {
      title: "Invitation Details",
      description: "View the details of this invitation.",
    },
    create: {
      title: "Send Invitation",
      description: "Provide recipient details to send a new system invitation.",
    },
    delete: {
      title: "Revoke Invitation",
      description:
        "This will cancel the invitation and prevent it from being used.",
    },
  },
  accessRequestsManagement: {
    view: {
      title: "Access Request Details",
      description: "Review details of this access request submission.",
    },
    update: {
      title: "Review Request",
      description:
        "Approve or deny the access request. Your decision will take effect immediately.",
    },
    delete: {
      title: "Remove Access Request",
      description: "This will permanently delete the access request record.",
    },
  },
  activityManagement: {
    view: {
      title: "Activity Log",
      description: "View the details of this recorded activity.",
    },
    delete: {
      title: "Delete Activity Log",
      description:
        "This will permanently delete the selected activity log entry.",
    },
  },
};

export const WASTE_TYPE_CONFIG: Record<WasteType, WasteTypeData> = {
  biodegradable: {
    label: "Biodegradable",
    icon: Leaf,
    style: "green-badge",
  },
  "non-biodegradable": {
    label: "Non-Biodegradable",
    icon: Trash2,
    style: "gray-badge",
  },
  recyclable: {
    label: "Recyclable",
    icon: Recycle,
    style: "blue-badge",
  },
};

export const USER_ROLE_CONFIG: Record<UserRole, ConfigDataValue> = {
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    style: "blue-badge",
  },
  maintenance: {
    label: "Maintenance",
    icon: Recycle,
    style: "orange-badge",
  },
  "not-set": {
    label: "Not Set",
    icon: Ban,
    style: "gray-badge",
  },
};

export const USER_INVITATION_STATUS_CONFIG: Record<
  InvitationStatus,
  ConfigDataValue
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    style: "yellow-badge",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    style: "green-badge",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    style: "red-badge",
  },
  expired: {
    label: "Expired",
    icon: Hourglass,
    style: "gray-badge",
  },
  confirmed: {
    label: "Confirmed",
    icon: ShieldCheck,
    style: "blue-badge",
  },
};

export const ACTION_CONFIG: Record<
  AuditActions,
  Omit<ConfigDataValue, "icon">
> = {
  create: { label: "Create", style: "green-badge" },
  update: { label: "Update", style: "blue-badge" },
  delete: { label: "Delete", style: "red-badge" },
  archive: { label: "Archive", style: "gray-badge" },
  restore: { label: "Restore", style: "purple-badge" },
  login: { label: "Login", style: "cyan-badge" },
  logout: { label: "Logout", style: "orange-badge" },
  invite: { label: "Invite", style: "teal-badge" },
  accept_invite: { label: "Accept Invite", style: "green-badge" },
  reject_invite: { label: "Reject Invite", style: "red-badge" },
  approve_request: { label: "Approve Request", style: "green-badge" },
  reject_request: { label: "Reject Request", style: "red-badge" },
};

export const USER_PERMISSION_CONFIG: Record<UserPermission, ConfigDataValue> = {
  viewer: {
    label: "Viewer",
    icon: Eye,
    style: "yellow-badge",
  },
  editor: {
    label: "Editor",
    icon: Edit3,
    style: "blue-badge",
  },
  superuser: {
    label: "Superuser",
    icon: ShieldCheck,
    style: "purple-badge",
  },
  "not-set": {
    label: "Not Set",
    icon: Ban,
    style: "gray-badge",
  },
};

export const ISSUE_STATUS_CONFIG: Record<IssueStatus, ConfigDataValue> = {
  open: {
    label: "Open",
    icon: Circle,
    style: "yellow-badge",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    style: "blue-badge",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    style: "green-badge",
  },
  closed: {
    label: "Closed",
    icon: XCircle,
    style: "red-badge",
  },
};

export const PRIORITY_SCORES_CONFIG: Record<PriorityScores, ConfigDataValue> = {
  low: {
    label: "Low",
    icon: ArrowDownCircle,
    style: "green-badge",
  },
  medium: {
    label: "Medium",
    icon: MinusCircle,
    style: "blue-badge",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    style: "yellow-badge",
  },
  critical: {
    label: "Critical",
    icon: AlertOctagon,
    style: "red-badge",
  },
};

export const REQUEST_STATUS_CONFIG: Record<RequestStatus, ConfigDataValue> = {
  pending: {
    label: "Pending",
    icon: Clock,
    style: "yellow-badge",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    style: "green-badge",
  },
  rejected: {
    label: "Denied",
    icon: XCircle,
    style: "red-badge",
  },
};
