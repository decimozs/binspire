import { useSession } from "@/features/auth";
import { Button } from "@binspire/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { ShowToast } from "./toast";
import { getToken } from "firebase/messaging";
import { messaging } from "@/features/firebase";
import { MessagingApi } from "@binspire/query";
import { Loader2 } from "lucide-react";

export default function Welcome() {
  const { data: current } = useSession();
  const [enabled, setEnabled] = useState(false);
  const [, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = current?.user.id;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem(
      "client_welcome_banner_dismissed",
    );

    if (hasDismissed) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  const handleCancel = () => {
    setEnabled(false);
    navigate({ to: "/" });
  };

  const handleClose = async () => {
    setLoading(true);

    if (!userId) return;

    if (!("Notification" in window)) {
      ShowToast("error", "This browser does not support notifications.");
      setEnabled(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        ShowToast("error", "Notification permission denied.");
        setEnabled(false);
        localStorage.setItem("notification_enabled", "false");
        return;
      }

      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (currentToken) {
        await MessagingApi.register(userId, currentToken);
        localStorage.setItem("fcm_token", currentToken);
        setToken(currentToken);
      }

      localStorage.setItem("client_welcome_banner_dismissed", "true");
      setLoading(false);
      setEnabled(false);
      navigate({ to: "/" });
    } catch {
      ShowToast("error", "Failed to enable notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocs = () => {
    handleClose();
    window.open("https://docs.binspire.space/", "_blank");
  };

  if (!current?.user) return null;

  return (
    <main className="p-4">
      <div>
        <img
          src="/favicon.ico"
          alt="Binspire"
          className="size-13 rounded-md mb-4"
        />
        <p className="font-bold text-4xl">
          Welcome to <br /> Binspire,{" "}
          <span className="text-primary">{current.user.name}</span>!
        </p>
        <p className="text-3xl text-muted-foreground font-bold mt-8">
          Smarter waste collection starts here. <br />
          <br /> Binspire empowers maintenance teams and waste collectors to
          track, manage, and optimize every pickup, helping you keep communities
          cleaner, safer, and more sustainable every day.
        </p>
      </div>
      <div className="fixed bottom-4 right-4 flex flex-row items-center gap-2">
        <Button
          variant="secondary"
          onClick={handleDocs}
          className="font-bold text-lg"
        >
          Docs
        </Button>

        <Drawer open={enabled} onOpenChange={setEnabled}>
          <DrawerTrigger asChild>
            <Button className="font-bold text-lg">Get Started</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-4xl">Ready to dive in?</DrawerTitle>
              <DrawerDescription>
                Make sure to enable your notifications to stay updated on your
                waste collection tasks and alerts!
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                onClick={handleClose}
                disabled={loading}
                className="font-bold text-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Enable"}
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="secondary"
                  className="font-bold text-lg"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  );
}
