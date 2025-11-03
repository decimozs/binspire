import type { UseMutationResult } from "@binspire/query";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@binspire/ui/components/dropdown-menu";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface ActionsDropdownProps<TData = unknown> {
  id: string;
  children?: ReactNode;
  onArchiveAction?: UseMutationResult<TData, Error, string, unknown>;
  onDeleteAction: UseMutationResult<TData, Error, string, unknown>;
}

export default function ActionsDropdown<TData = unknown>({
  id,
  children,
  onArchiveAction,
  onDeleteAction,
}: ActionsDropdownProps<TData>) {
  return (
    <DropdownMenuContent side="right" align="start">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {children && <DropdownMenuItem>{children}</DropdownMenuItem>}

      <DropdownMenuItem onClick={() => onArchiveAction?.mutate(id)}>
        Archive
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        variant="destructive"
        onClick={() => onDeleteAction.mutate(id)}
      >
        {onDeleteAction.isPending ? <Loader2 /> : "Delete"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
