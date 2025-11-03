import { authClient } from "@/lib/auth-client";
import { Button } from "@binspire/ui/components/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    await authClient.signOut();
    setPending(false);
    window.location.href = "/auth";
  };

  return (
    <Button onClick={handleLogout} disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}
