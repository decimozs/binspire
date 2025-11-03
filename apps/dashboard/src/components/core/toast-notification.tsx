import { toast } from "@binspire/ui/toast";
import {
  CircleCheckIcon,
  AlertTriangleIcon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

const iconMap: Record<
  ToastType,
  { icon: ReactNode; color: string; background: string }
> = {
  success: {
    icon: (
      <CircleCheckIcon className="mt-1 shrink-0 text-emerald-500" size={16} />
    ),
    color: "emerald-500",
    background: "bg-emerald-500/10",
  },
  error: {
    icon: <XCircleIcon className="mt-1 shrink-0 text-red-500" size={16} />,
    color: "red-500",
    background: "bg-red-500/10",
  },
  info: {
    icon: <InfoIcon className="mt-1 shrink-0 text-blue-500" size={16} />,
    color: "blue-500",
    background: "bg-blue-500/10",
  },
  warning: {
    icon: (
      <AlertTriangleIcon className="mt-1 shrink-0 text-yellow-500" size={16} />
    ),
    color: "yellow-500",
    background: "bg-yellow-500/10",
  },
};

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export function ShowToast(
  type: ToastType,
  message: string,
  position: Position = "bottom-right",
) {
  const { icon, color } = iconMap[type];

  toast.custom(
    () => (
      <div
        className={`z-100 bg-background text-foreground w-full rounded-md border-${color} border-[1px] px-4 py-3 shadow-lg sm:w-[var(--width)]`}
      >
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            {icon}
            <span>{message}</span>
          </div>
        </div>
      </div>
    ),
    { position },
  );
}
