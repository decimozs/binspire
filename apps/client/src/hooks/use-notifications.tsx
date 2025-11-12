import { messaging } from "@/features/firebase";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "@binspire/ui/toast";

export function useNotifications() {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = payload.notification;

      if (notification) {
        toast.custom(() => (
          <div
            className={`z-100 bg-background text-foreground w-full rounded-md border-primary border-[1px] px-4 py-3 shadow-lg sm:w-[var(--width)]`}
          >
            <div className="flex flex-col">
              <p className="font-bold">{notification.title}</p>
              <p className="">{notification.body}</p>
            </div>
          </div>
        ));
      }
    });

    return () => unsubscribe();
  }, []);
}
