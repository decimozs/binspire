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

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  key?: string;
  url?: string;
}

const LOCAL_STORAGE_KEY = "notifications";

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const initial = Array.from({ length: 10 }).map((_, index) => ({
        id: index,
        title: `title ${index + 1}`,
        description: `description ${index + 1}`,
        timestamp: new Date().toLocaleTimeString(),
      }));
      setNotifications(initial);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => setNotifications([]);
  const clearAll = () => setNotifications([]);

  const handleView = (notif: NotificationItem) => {
    const query = { key: notif.key, url: notif.url };

    if (!query?.key || !query.url) return;

    const url = window.location.href.split("?")[0];
    const newQuery = `${query.key}=${JSON.stringify(query.url)}`;
    window.history.pushState({}, "", `${url}?${newQuery}`);
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 relative">
          <Bell />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[600px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {notifications.length === 0
              ? "You have no new notifications."
              : `You have ${notifications.length} notifications.`}
          </SheetDescription>
        </SheetHeader>
        <div className="-mt-4 px-4">
          <ScrollArea className="h-[85vh]">
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  className="bg-card rounded-md p-4 border-[1px] border-secondary flex flex-col gap-2"
                  key={notif.id}
                >
                  <div>
                    <p>{notif.title}</p>
                    <p>{notif.description}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-sm">
                      {formatDistanceToNow(new Date(notif.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex flex-row items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
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
        </div>
        {notifications.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>No notifications</EmptyTitle>
              <EmptyDescription>No data found</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
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
