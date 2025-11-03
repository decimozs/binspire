import {
  CircleCheckIcon,
  AlertTriangleIcon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import { toast, Toaster } from "sonner";
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
    color: "text-emerald-500",
    background: "bg-emerald-500/10",
  },
  error: {
    icon: <XCircleIcon className="mt-1 shrink-0 text-red-500" size={16} />,
    color: "text-red-500",
    background: "bg-red-500/10",
  },
  info: {
    icon: <InfoIcon className="mt-1 shrink-0 text-blue-500" size={16} />,
    color: "text-blue-500",
    background: "bg-blue-500/10",
  },
  warning: {
    icon: (
      <AlertTriangleIcon className="mt-1 shrink-0 text-yellow-500" size={16} />
    ),
    color: "text-yellow-500",
    background: "bg-yellow-500/10",
  },
};

export function ToastNotification(type: ToastType, message: string) {
  const { icon, background } = iconMap[type];

  toast.custom(() => (
    <div
      className={`${background} backdrop-blur-xl backdrop-filter text-foreground w-full rounded-md px-4 py-3 shadow-lg sm:w-[var(--width)]`}
    >
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          {icon}
          <span>{message}</span>
        </div>
      </div>
    </div>
  ));
}

export { Toaster, toast };
