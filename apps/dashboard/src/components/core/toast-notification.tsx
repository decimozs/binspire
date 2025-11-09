import { Button } from "@binspire/ui/components/button";
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
  { icon: ReactNode; borderColor: string; background: string }
> = {
  success: {
    icon: (
      <CircleCheckIcon className="mt-1 shrink-0 text-emerald-500" size={16} />
    ),
    borderColor: "border-emerald-500",
    background: "bg-emerald-500/10",
  },
  error: {
    icon: <XCircleIcon className="mt-1 shrink-0 text-red-500" size={16} />,
    borderColor: "border-red-500",
    background: "bg-red-500/10",
  },
  info: {
    icon: <InfoIcon className="mt-1 shrink-0 text-blue-500" size={16} />,
    borderColor: "border-blue-500",
    background: "bg-blue-500/10",
  },
  warning: {
    icon: (
      <AlertTriangleIcon className="mt-1 shrink-0 text-yellow-500" size={16} />
    ),
    borderColor: "border-yellow-500",
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
  action?: boolean,
  query?: { key: string; url: string },
) {
  const { icon, borderColor } = iconMap[type];

  toast.custom(
    () => (
      <div
        className={`z-100 bg-background text-foreground w-full rounded-md ${borderColor} border-[1px] px-4 py-3 shadow-lg ${position === "top-center" && "min-w-[500px]"}`}
      >
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            {icon}
            <span>{message}</span>
          </div>
        </div>
        {action && (
          <div className="mt-2 flex flex-row items-center gap-2 justify-end">
            <Button
              size="sm"
              variant="secondary"
              className="h-6"
              onClick={() => {
                if (!query?.key || !query.url) return;

                const url = window.location.href.split("?")[0];
                const newQuery = `${query.key}=${JSON.stringify(query.url)}`;
                window.history.pushState({}, "", `${url}?${newQuery}`);
                window.dispatchEvent(new Event("popstate"));
              }}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-6"
              onClick={() => toast.dismiss()}
            >
              Dismiss
            </Button>
          </div>
        )}
      </div>
    ),
    { position },
  );
}
