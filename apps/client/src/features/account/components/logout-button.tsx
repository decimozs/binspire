import { ShowToast } from "@/components/toast";
import { authClient } from "@/features/auth";
import { Button } from "@binspire/ui/components/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

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
