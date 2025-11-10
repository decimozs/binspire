import { useEffect, useState } from "react";
import { Button } from "@binspire/ui/components/button";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Bell } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  key?: string;
  url?: { type: string; id: string; action: string[] };
  isRead?: boolean;
}

const LOCAL_STORAGE_KEY = "notifications";

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored) setNotifications(JSON.parse(stored));

    const handleUpdate = (e: CustomEvent<NotificationItem[]>) => {
      setNotifications(e.detail);
    };

    window.addEventListener(
      "notifications-updated",
      handleUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "notifications-updated",
        handleUpdate as EventListener,
      );
    };
  }, []);

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => setNotifications([]);
  const clearAll = () => setNotifications([]);

  const handleView = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
    );

    const stored = notifications.map((n) =>
      n.id === notif.id ? { ...n, isRead: true } : n,
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored));

    const query = { key: notif.key, url: notif.url };
    if (!query?.key || !query.url) return;

    const url = window.location.href.split("?")[0];
    const newQuery = `${query.key}=${JSON.stringify(query.url)}`;
    window.history.pushState({}, "", `${url}?${newQuery}`);
    window.dispatchEvent(new Event("popstate"));
  };

  const handleBellClick = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 relative"
              onClick={handleBellClick}
            >
              <Bell />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full font-bold text-[9px] flex items-center justify-center size-4">
                  <p>{notifications.filter((n) => !n.isRead).length}</p>
                </span>
              )}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="font-bold">Notifications</p>
        </TooltipContent>
      </Tooltip>
      <SheetContent className="min-w-[600px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          {notifications.length > 0 && (
            <SheetDescription>
              {`You have ${notifications.length} notifications.`}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="-mt-4 px-4">
          {notifications.length > 0 && (
            <ScrollArea className="h-[85vh]">
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    className="bg-card rounded-md p-4 border-[1px] border-secondary flex flex-col gap-2"
                    key={notif.id}
                  >
                    <div>
                      <p className="mb-2">{notif.title}</p>
                      <p className="text-sm">{notif.description}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-sm">
                          {formatDistanceToNow(new Date(notif.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                        <p
                          className={`w-fit ${notif.isRead ? "blue-badge" : "yellow-badge"}`}
                        >
                          {notif.isRead ? "Read" : "Unread"}
                        </p>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <Button
                          size="sm"
                          variant={notif.isRead ? "outline" : "secondary"}
                          onClick={() => handleView(notif)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => clearNotification(notif.id)}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {notifications.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell />
                </EmptyMedia>
                <EmptyTitle>You have no notifications</EmptyTitle>
                <EmptyDescription>
                  You're all caught up! Check back later for new notifications.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
        {notifications.length > 0 && (
          <SheetFooter className="flex flex-row items-center justify-between text-muted-foreground">
            <p className="cursor-pointer" onClick={markAllAsRead}>
              Mark all as read
            </p>
            <p className="cursor-pointer" onClick={clearAll}>
              Clear notifications
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
