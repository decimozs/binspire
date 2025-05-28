import type { LucideIcon } from "lucide-react";
import { NavOperations } from "@/components/sidebar/nav-operations";
import { NavShortcuts } from "@/components/sidebar/nav-shortcuts";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Archive,
  AudioWaveform,
  Battery,
  Book,
  Calendar,
  CircleArrowUp,
  CircleCheck,
  CircleDashed,
  CircleMinus,
  CircleOff,
  CirclePlus,
  CircleX,
  Clock,
  Diff,
  FilePenIcon,
  Folder,
  Frame,
  GalleryVerticalEnd,
  HardHat,
  House,
  Info,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  PieChart,
  Plus,
  Settings,
  Settings2,
  ShieldUser,
  Trash,
  UserRound,
  UserRoundPen,
  UserRoundPlus,
  UsersRound,
  Weight,
  X,
} from "lucide-react";
import type {
  Action,
  FilterTrashbinGroup,
  MapLayer,
  Permission,
  Role,
  Status,
  Title,
} from "./types";
import type { TrashbinLevelProps } from "@/components/charts/trashbin-levels";
import type { ViewState } from "react-map-gl/maplibre";

export const icons = {
  github: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  `,

  google: `
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
`,
};

export interface NavUser {
  name: string;
  email: string;
  avatar: string;
}

export interface NavMapSwitcher {
  label: string;
  image: string;
}

interface NavOperationsItem {
  title: string;
  url: string;
}

export interface NavOperations {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items: NavOperationsItem[];
}

export interface NavShortcuts {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface NavigationItems {
  user: NavUser;
  mapSwitcher: NavMapSwitcher[];
  operations: NavOperations[];
  shortcuts: NavShortcuts[];
}

export const adminData = {
  teams: [
    {
      name: "Admin",
      icon: GalleryVerticalEnd,
      onlines: "123",
    },
    {
      name: "Collector",
      icon: AudioWaveform,
      onlines: "42",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Map",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "User",
      url: "#",
      icon: UserRound,
      items: [
        {
          title: "Management",
          url: "/dashboard/user/management",
        },
        {
          title: "Access Requests",
          url: "/dashboard/user/access-requests",
        },
        {
          title: "Activity Logs",
          url: "/dashboard/user/activity-logs",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/user/roles-permissions",
        },
      ],
    },
    {
      title: "Trashbin",
      url: "#",
      icon: Trash,
      items: [
        {
          title: "Management",
          url: "/dashboard/trashbin/management",
        },
        {
          title: "Issues",
          url: "/dashboard/trashbin/issues",
        },
        {
          title: "Collection",
          url: "/dashboard/trashbin/collections",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Appearance",
          url: "/dashboard/settings/appearance",
        },
        {
          title: "Backup",
          url: "/dashboard/settings/backup",
        },
        {
          title: "About",
          url: "/dashboard/settings/about",
        },
      ],
    },
  ],
  projects: [
    {
      name: "User Management",
      url: "#",
      icon: Frame,
    },
    {
      name: "Trashbin Management",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Change Theme",
      url: "#",
      icon: Map,
    },
  ],
};

export const collectorData = {
  teams: [
    {
      name: "Admin",
      icon: GalleryVerticalEnd,
      onlines: "123",
    },
    {
      name: "Collector",
      icon: AudioWaveform,
      onlines: "42",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Trashbins",
      url: "#",
      icon: Trash,
      items: [
        {
          title: "Issues",
          url: "/dashboard/trashbin/issues",
        },
        {
          title: "Collection",
          url: "/dashboard/trashbin/collections",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Appearance",
          url: "/dashboard/settings/appearance",
        },
        {
          title: "Backup",
          url: "/dashboard/settings/backup",
        },
        {
          title: "About",
          url: "/dashboard/settings/about",
        },
      ],
    },
  ],
};

export const tableRowColumns = {
  accessRequestTable: [
    { label: "Name", icon: UserRound },
    { label: "Email", icon: Mail },
    { label: "Role", icon: UsersRound },
    { label: "Status", icon: Clock },
    { label: "Requested At", icon: Calendar },
    { label: "", alignRight: true },
  ],
  userManagementTable: [
    { label: "Name", icon: UserRound },
    { label: "Email", icon: Mail },
    { label: "Role", icon: UsersRound },
    { label: "Joined on", icon: Clock },
    { label: "", alignRight: true },
  ],
  userActivityTable: [
    { label: "Type", icon: UserRound },
    { label: "Name", icon: Mail },
    { label: "Reason", icon: UsersRound },
    { label: "Status", icon: Clock },
    { label: "Created At", icon: Clock },
    { label: "", alignRight: true },
  ],
  rolesAndPermissionsTable: [
    { label: "Name", icon: UserRound },
    { label: "Email", icon: Mail },
    { label: "Role", icon: UsersRound },
    { label: "Permission", icon: KeyRound },
    { label: "", alignRight: true },
  ],
  activityLogsTable: [
    { label: "From", icon: Folder },
    { label: "Description", icon: Mail },
    { label: "Status", icon: UsersRound },
    { label: "Changed By", icon: UserRoundPen },
    { label: "Created At", icon: Clock },
    { label: "", alignRight: true },
  ],
  trashbinsManagementTable: [
    { label: "Name", icon: Trash },
    { label: "Waste", icon: CircleDashed },
    { label: "Weight", icon: Weight },
    { label: "Battery", icon: Battery },
    { label: "Created At", icon: Clock },
    { label: "", alignRight: true },
  ],
  trashbinsIssueTable: [
    { label: "Issue", icon: Info },
    { label: "Trashbin", icon: Trash },
    { label: "Description", icon: Mail },
    { label: "Status", icon: CircleDashed },
    { label: "Issued by", icon: UserRound },
    { label: "Created At", icon: Clock },
    { label: "", alignRight: true },
  ],
  trashbinsCollectionTable: [
    { label: "Trashbin", icon: Trash },
    { label: "Collected by", icon: UserRound },
    { label: "Status", icon: CircleDashed },
    { label: "Collected At", icon: Clock },
    { label: "", alignRight: true },
  ],
};

export const statusIcons: Record<Status, LucideIcon> = {
  fixed: CirclePlus,
  ongoing: CircleArrowUp,
  success: CircleCheck,
  failed: CircleX,
  active: CircleArrowUp,
  pending: Clock,
  blocked: CircleMinus,
  approved: CircleCheck,
  rejected: CircleX,
};

export const roleIcons: Record<Role, LucideIcon> = {
  admin: ShieldUser,
  collector: HardHat,
};

export const permissionIcons: Record<Permission, LucideIcon> = {
  editor: FilePenIcon,
  viewer: Book,
  "full-access": Settings,
};

export const fromTitle: Record<Title, string> = {
  audit: "Audit",
  history: "History",
  authentication: "Authentication",
  settings: "Settings",
  "user-management": "User Management",
  "access-request": "Access Request",
  "roles-permissions": "Roles & Permissions",
  "activity-logs": "Activity Logs",
};

export const actionIcons: Record<Action, LucideIcon> = {
  create: Plus,
  delete: X,
  update: Diff,
  archive: Archive,
  login: LogIn,
  logout: LogOut,
  "sign-up": UserRoundPlus,
};

export const TRASHBIN_STATUSES = [
  "empty",
  "moderate",
  "almost-full",
  "full",
  "overflowing",
  "light",
  "moderate",
  "heavy",
  "overweight",
  "hazardous",
  "high",
  "medium",
  "low",
  "critical",
] as const;

export const trashbinStatusColorMap: Record<
  TrashbinLevelProps["status"],
  string
> = {
  empty: "#22c55e",
  moderate: "#facc15",
  "almost-full": "#fb923c",
  full: "#f87171",
  overflowing: "#a78bfa",
  light: "#22c55e",
  heavy: "#f87171",
  overweight: "#f87171",
  hazardous: "#a78bfa",
  high: "#22c55e",
  medium: "#facc15",
  low: "#f87171",
  critical: "#ef4444",
};

export const INITIAL_VIEW_STATE: Partial<ViewState> = {
  longitude: 121.07618705298137,
  latitude: 14.577577090977371,
  zoom: 18.3,
  pitch: 100,
  bearing: 10,
};

export const mapLayerItems: Array<MapLayer> = [
  {
    layer: "0196585a-8568-78da-9d4f-9e0a23f2efd9",
    layerImage: "/map-layers/streets-layer.png",
    name: "Streets",
  },
  {
    layer: "795743a4-38e8-4e66-b7c1-6703814bb030",
    layerImage: "/map-layers/default-layer.png",
    name: "Binspire",
  },
];

export const trashbinsFilterOptions: FilterTrashbinGroup[] = [
  {
    key: "wl",
    label: "Waste Status",
    setParamKey: "setWasteStatusParam",
    options: [
      { label: "Overflowing", value: "overflowing", color: "bg-violet-400" },
      { label: "Full", value: "full", color: "bg-red-400" },
      { label: "Almost Full", value: "almost_full", color: "bg-orange-400" },
      { label: "Moderate", value: "moderate", color: "bg-yellow-400" },
      { label: "Empty", value: "empty", color: "bg-green-400" },
    ],
  },
  {
    key: "ws",
    label: "Weight Status",
    setParamKey: "setWeightStatusParam",
    options: [
      { label: "Hazardous", value: "hazardous", color: "bg-violet-400" },
      { label: "Overweight", value: "overweight", color: "bg-red-400" },
      { label: "Heavy", value: "heavy", color: "bg-orange-400" },
      { label: "Light", value: "light", color: "bg-green-400" },
    ],
  },
  {
    key: "bs",
    label: "Battery Status",
    setParamKey: "setBatteryStatusParam",
    options: [
      { label: "Full", value: "full", color: "bg-green-500" },
      { label: "Medium", value: "medium", color: "bg-yellow-500" },
      { label: "Low", value: "low", color: "bg-red-400" },
      { label: "Critical", value: "critical", color: "bg-red-500" },
    ],
  },
];
