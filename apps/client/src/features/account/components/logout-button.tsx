import { UserStatusApi } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ShowToast } from "@/components/toast";
import { authClient } from "@/features/auth";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const { data: current } = authClient.useSession();
  const userId = current?.user.id;

  const handleLogout = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      await UserStatusApi.update(userId, { isOnline: false });

      const { error } = await authClient.signOut();

      if (error) throw new Error(error.message);

      window.location.href = "/login";
    } catch (err) {
      const error = err as Error;
      ShowToast("error", error.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={loading}
      className="font-bold text-lg"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}
