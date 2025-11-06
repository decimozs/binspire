import { useEffect, useState } from "react";
import { messaging } from "@/features/firebase";
import { getToken } from "firebase/messaging";
import { MessagingApi } from "@binspire/query";
import { authClient } from "@/features/auth";
import { ShowToast } from "@/components/toast";

export const useFCMToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const { data } = authClient.useSession();

  useEffect(() => {
    if (!data?.user) return;

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      return;
    }

    const registerFCMToken = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          return;
        }

        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (!currentToken) {
          return;
        }

        await MessagingApi.register(data.user.id, currentToken);

        const lastToken = localStorage.getItem("fcm_token");

        if (currentToken === lastToken) {
          setToken(currentToken);
          return;
        }

        await MessagingApi.register(data.user.id, currentToken);
        localStorage.setItem("fcm_token", currentToken);

        setToken(currentToken);
      } catch {
        ShowToast("error", "Notification initialization failed");
      }
    };

    registerFCMToken();
  }, [data?.user]);

  return token;
};
