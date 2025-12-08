import { UserStatusApi } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  const { data: current } = authClient.useSession();
  const userId = current?.user.id;

  const handleLogout = async () => {
    if (!userId) return;

    setPending(true);
    await authClient.signOut();
    await UserStatusApi.update(userId, { isOnline: false });
    setPending(false);
    window.location.href = "/auth";
  };

  return (
    <Button onClick={handleLogout} disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}
