import type { LucideIcon } from "lucide-react";
import type { backupFrequencies, fonts, themes } from "./constants";

export type SettingType = "general" | "appearance" | "backup" | "about";

export interface SettingConfig {
  type: SettingType;
  label: string;
  icon?: LucideIcon;
  url: string;
}

export type Theme = (typeof themes)[number]["value"];
export type Font = (typeof fonts)[number]["value"];
export type BackupFrequency = (typeof backupFrequencies)[number]["value"];
