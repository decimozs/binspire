import { usePermissionStore } from "@/store/permission-store";
import { Button } from "@binspire/ui/components/button";
import { Mail } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function InviteUserButton() {
  const [, setInvitingUserQuery] = useQueryState(
    "inviting_user",
    parseAsBoolean.withDefault(false),
  );
  const { permission } = usePermissionStore();

  const hasPermission = permission.userManagement?.actions.create;

  if (!hasPermission) {
    return null;
  }

  return (
    <Button
      onClick={() => setInvitingUserQuery((prev) => !prev)}
      size="sm"
      className="font-bold"
    >
      <Mail />
      Invite
    </Button>
  );
}
