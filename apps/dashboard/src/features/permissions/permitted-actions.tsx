import type { ActionsTypeManagement, ModuleActions } from "@binspire/shared";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@binspire/ui/components/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { useActionDialog } from "@/hooks/use-action-dialog";
import { PermissionGuard } from "./components/permission-guard";

interface PermittedActionsProps {
  actions?: ModuleActions;
  type: ActionsTypeManagement;
  itemId: string;
  isUser?: boolean;
}

export default function PermittedActions({
  actions,
  type,
  itemId,
  isUser = false,
}: PermittedActionsProps) {
  const { setQuery } = useActionDialog({ queryKey: type, actionKey: "view" });
  const navigate = useNavigate();

  const handleView = () => {
    setQuery({ type, id: itemId, action: ["view"] });
  };

  const handleDelete = () => {
    setQuery({ type, id: itemId, action: ["delete"] });
  };

  const handleViewUser = (id: string) => {
    navigate({ to: "/users/$userId", params: { userId: id } });
  };

  return (
    <PermissionGuard>
      {actions?.read && (
        <DropdownMenuItem
          onClick={isUser ? () => handleViewUser(itemId) : handleView}
        >
          View
        </DropdownMenuItem>
      )}
      {actions?.delete && (
        <>
          {type !== "greenHeartsManagement" && <DropdownMenuSeparator />}
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </>
      )}
    </PermissionGuard>
  );
}
