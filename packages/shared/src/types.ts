import type { LucideIcon } from "lucide-react";
import type {
  AUDIT_ACTIONS,
  INVITATION_STATUSES,
  ISSUE_STATUSES,
  PRIORITY_SCORES,
  REQUEST_STATUSES,
} from "./constants";

export interface AppearanceOpts {
  theme: string;
  font: string;
}

export interface UserSettingsOpts {
  appearance: AppearanceOpts;
}

type BackupFrequency = "daily" | "weekly" | "monthly";

export interface GeneralOpts {
  wasteLevelThreshold: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface BackupOpts {
  autoBackup: boolean;
  backupFrequency: BackupFrequency;
}

export interface OrganizationSettingsOpts {
  general?: GeneralOpts;
  backup?: BackupOpts;
}

export type ModuleActions = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type ModulePermissions = {
  actions: ModuleActions;
};

export type PermissionModules = {
  userManagement?: ModulePermissions;
  trashbinManagement?: ModulePermissions;
  settingsManagement?: ModulePermissions;
  dashboardManagement?: ModulePermissions;
  boardManagement?: ModulePermissions;
  issueManagement?: ModulePermissions;
  activityManagement?: ModulePermissions;
  historyManagement?: ModulePermissions;
  accessRequestsManagement?: ModulePermissions;
  invitationsManagement?: ModulePermissions;
  collectionsManagement?: ModulePermissions;
  mapManagement?: ModulePermissions;
  greenHeartsManagement?: ModulePermissions;
};

export type UserPermissionOpts = PermissionModules;

export type PermissionModuleKeys = keyof PermissionModules;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export type PriorityScores = (typeof PRIORITY_SCORES)[number];

export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

export type AuditActions = (typeof AUDIT_ACTIONS)[number];

interface ActionsTypeInfo {
  title: string;
  description: string;
}

type StringModuleActions = {
  create?: ActionsTypeInfo;
  view?: ActionsTypeInfo;
  update?: ActionsTypeInfo;
  delete?: ActionsTypeInfo;
};

export type ActionsTypeManagement = keyof PermissionModules;

export type ActionDialogValues = Record<
  ActionsTypeManagement,
  StringModuleActions
>;

export type WasteType = "biodegradable" | "non-biodegradable" | "recyclable";

export interface WasteTypeData {
  label: string;
  icon: LucideIcon;
  style: string;
}

export interface ConfigDataValue {
  label: string;
  icon: LucideIcon;
  style: string;
}

export type UserRole = "admin" | "maintenance" | "not-set";

export type UserPermission = "viewer" | "editor" | "superuser" | "not-set";

export interface MenuItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: MenuItem[];
  tab?: string;
}
