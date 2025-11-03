import { usePermissionStore } from "@/store/permission-store";
import { Button } from "@binspire/ui/components/button";
import { useLocation } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function CreateIssueButton() {
  const location = useLocation();
  const [, setCreateIssue] = useQueryState(
    "is_creating_issue",
    parseAsBoolean.withDefault(false),
  );

  const { permission } = usePermissionStore();

  const hasPermission = permission.issueManagement?.actions.create;

  if (!hasPermission) {
    return null;
  }

  if (location.pathname !== "/issues") return null;

  const handleCreateIssue = () => {
    setCreateIssue(true);
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleCreateIssue}
      className="font-bold"
    >
      <Info />
      New Issue
    </Button>
  );
}
