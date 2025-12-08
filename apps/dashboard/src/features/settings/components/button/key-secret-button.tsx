import { Button } from "@binspire/ui/components/button";
import { parseAsBoolean, useQueryState } from "nuqs";
import { usePermissionStore } from "@/store/permission-store";

export default function GenerateKeySecretButton() {
  const { permission } = usePermissionStore();
  const [, setOpen] = useQueryState(
    "generate_secret",
    parseAsBoolean.withDefault(false),
  );
  const hasPermission = permission.settingsManagement?.actions.update;

  return (
    <Button
      size="lg"
      variant="secondary"
      type="button"
      className="w-full"
      onClick={() => setOpen(true)}
      disabled={!hasPermission}
    >
      Generate Key Secret
    </Button>
  );
}
