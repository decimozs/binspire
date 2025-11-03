import { DatabaseBackup, Info, Palette, Settings2 } from "lucide-react";
import type { SettingConfig } from "./types";

export const settingsConfig: SettingConfig[] = [
  {
    type: "general",
    label: "General",
    url: "/settings",
    icon: Settings2,
  },
  {
    type: "appearance",
    label: "Appearance",
    url: "/settings/appearance",
    icon: Palette,
  },
  {
    type: "backup",
    label: "Backup",
    icon: DatabaseBackup,
    url: "/settings/backup",
  },
  {
    type: "about",
    label: "About",
    icon: Info,
    url: "/settings/about",
  },
];

export const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
] as const;

export const fonts = [
  { label: "Manrope", value: "manrope" },
  { label: "Inter", value: "inter" },
  { label: "Roboto", value: "roboto" },
  { label: "Montserrat", value: "montserrat" },
] as const;

export const backupFrequencies = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
] as const;

export const darkStyle = "019806b1-7482-71db-96b3-1ee247f83d51";
export const lightStyle = "streets";

export const settingsLightStyle = "streets";
export const settingsDarkStyle = "01999d4a-fa19-7b78-ab1e-2c93c0a32ba0";

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  requiredPoints: number;
}

export const REWARDS: RewardItem[] = [
  {
    id: "landers-100",
    title: "₱100 Landers Superstore Voucher",
    description:
      "Treat yourself while helping the planet! Redeem ₱100 worth of groceries, snacks, or essentials at Landers Superstore.",
    details: [
      "Redeemable at any Landers branch or online.",
      "Valid for 3 months from redemption date.",
      "Redeem 800 GreenHearts to claim.",
    ],
    requiredPoints: 100,
  },
  {
    id: "landers-eco-tote",
    title: "Eco-Friendly Shopping Tote",
    description:
      "Ditch the plastic — go reusable! A stylish Landers-branded eco tote made from recycled materials.",
    details: [
      "Redeem 800 GreenHearts to claim.",
      "Available in limited colors.",
      "Pick up in-store or have it delivered with your next Landers order.",
    ],
    requiredPoints: 800,
  },
  {
    id: "landers-500-bundle",
    title: "₱500 Grocery Bundle (Sustainable Picks)",
    description: "A curated pack of eco-friendly or organic grocery products.",
    details: [
      "Includes reusable straws, organic snacks, and biodegradable kitchen essentials.",
      "Exclusive to GreenHearts users.",
      "Redeemable with 2000 GreenHearts.",
    ],
    requiredPoints: 2000,
  },
];
