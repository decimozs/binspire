import { MessagingApi } from "@binspire/query";
import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { ShowToast } from "@/components/toast";
import { authClient } from "@/features/auth";
import { messaging } from "@/features/firebase";

export const useFCMToken = (askPermission = false) => {
  const [token, setToken] = useState<string | null>(null);
  const { data } = authClient.useSession();

  useEffect(() => {
    if (!data?.user) return;

    if (!("serviceWorker" in navigator)) return;

    const registerFCMToken = async () => {
      try {
        if (askPermission && "Notification" in window) {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;
        }

        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (!currentToken) return;

        const lastToken = localStorage.getItem("fcm_token");

        if (currentToken !== lastToken) {
          await MessagingApi.register(data.user.id, currentToken);
          localStorage.setItem("fcm_token", currentToken);
        }

        setToken(currentToken);
      } catch (e) {
        console.error(e);
        ShowToast("error", "Notification initialization failed");
      }
    };

    registerFCMToken();
  }, [data?.user, askPermission]);

  return token;
};
