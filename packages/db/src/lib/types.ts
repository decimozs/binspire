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
