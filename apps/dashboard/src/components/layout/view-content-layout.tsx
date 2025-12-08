import { useUpdateUserRequest } from "@binspire/query";
import {
  type ActionsTypeManagement,
  formatDate,
  formatRelativeDate,
  type RequestStatus,
} from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Separator } from "@binspire/ui/components/separator";
import { Loader2 } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { type ActionType, useActionDialog } from "@/hooks/use-action-dialog";
import { usePermissionStore } from "@/store/permission-store";
import CopyToClipboardButton from "../core/copy-clipboard";
import ShowQrCode from "../core/show-qr-code";

interface DataTimestamps {
  createdAt: string;
  updatedAt: string;
}

interface Keys {
  queryKey: ActionsTypeManagement;
  actionKey: ActionType;
}

interface ViewContentLayoutProps<T extends DataTimestamps & { id: string }> {
  keys: Keys;
  data: T | null | undefined;
  isPending: boolean;
  enabledEditMode?: boolean;
  renderHeader?: (data: T) => React.ReactNode;
  renderComponents: (data: T) => React.ReactNode;
}

function ViewContentLayoutComponent<T extends DataTimestamps & { id: string }>({
  data,
  keys,
  isPending,
  enabledEditMode = false,
  renderHeader,
  renderComponents,
}: ViewContentLayoutProps<T>) {
  const { queryId, setQuery, editMode, setEditMode, setReviewMode } =
    useActionDialog(keys);

  const { queryKey } = keys;
  const updateUserRequest = useUpdateUserRequest();
  const [requestStatus, setRequestStatus] = useState<RequestStatus | null>(
    null,
  );

  const [isFormDirty, setIsFormDirty] = useQueryState(
    "is_form_dirty",
    parseAsBoolean.withDefault(false),
  );

  const { permission } = usePermissionStore();

  const handleDelete = useCallback(() => {
    setQuery((prev) => ({
      type: queryKey,
      id: queryId!,
      action: Array.from(new Set([...(prev?.action ?? []), "delete"])),
    }));
  }, [queryId, queryKey, setQuery]);

  const handleEdit = useCallback(() => setEditMode(true), [setEditMode]);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setIsFormDirty(false);
  }, [setEditMode, setIsFormDirty]);

  const handleUpdate = useCallback(() => {
    setQuery((prev) => ({
      type: queryKey,
      id: queryId!,
      action: Array.from(new Set([...(prev?.action ?? []), "update"])),
    }));
  }, [queryId, queryKey, setQuery]);

  const handleReview = useCallback(() => {
    setReviewMode(true);
    setQuery((prev) => ({
      type: queryKey,
      id: queryId!,
      action: Array.from(new Set([...(prev?.action ?? []), "review"])),
    }));
  }, [queryId, queryKey, setQuery, setReviewMode]);

  const handleUpdateUserRequest = async () => {
    if (queryKey === "accessRequestsManagement") {
      await updateUserRequest.mutateAsync({
        id: queryId!,
        data: { status: requestStatus! },
      });
      setRequestStatus(null);
    }
  };

  if (isPending) return <Loader2 className="animate-spin" />;
  if (!data) return <p>No data found</p>;

  const renderActionButtons = () => {
    if (!permission[queryKey]) return null;

    const { actions } = permission[queryKey];
    const buttons: React.ReactNode[] = [];

    if (
      actions.delete &&
      !editMode &&
      queryKey !== "activityManagement" &&
      queryKey !== "accessRequestsManagement"
    ) {
      buttons.push(
        <Button
          key="delete"
          variant="destructive"
          className={
            queryKey === "trashbinManagement" || queryKey === "issueManagement"
              ? "w-[50%]"
              : "w-full"
          }
          onClick={handleDelete}
          size="sm"
        >
          Delete
        </Button>,
      );
    }

    if (actions.delete && !editMode && queryKey === "activityManagement") {
      buttons.push(
        <Button
          key="delete"
          variant="destructive"
          className="w-[50%]"
          onClick={handleDelete}
          size="sm"
        >
          Delete
        </Button>,
        <Button
          key="review"
          variant="secondary"
          className="w-[50%]"
          size="sm"
          onClick={handleReview}
        >
          Review Changes
        </Button>,
      );
    }

    if (
      actions.delete &&
      !editMode &&
      queryKey === "accessRequestsManagement"
    ) {
      const accessRequest = data as T & { status?: RequestStatus };
      const currentStatus = accessRequest?.status ?? requestStatus;

      if (currentStatus === "approved" || currentStatus === "rejected") {
        buttons.push(
          <Button
            key="delete"
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            size="sm"
          >
            Delete
          </Button>,
        );
      } else {
        buttons.push(
          <Button
            key="delete"
            variant="destructive"
            className="grow"
            onClick={handleDelete}
            size="sm"
          >
            Delete
          </Button>,

          !requestStatus ? (
            <DropdownMenu key="status">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-[50%] capitalize"
                  size="sm"
                >
                  Update Request
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[225px]">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRequestStatus("approved")}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRequestStatus("rejected")}>
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              key="status-done"
              variant={
                requestStatus === "approved" ? "secondary" : "destructive"
              }
              className="w-[50%] capitalize"
              onClick={handleUpdateUserRequest}
              size="sm"
              disabled={updateUserRequest.isPending}
            >
              {updateUserRequest.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                requestStatus
              )}
            </Button>
          ),
        );
      }
    }

    if (actions.update && enabledEditMode) {
      if (editMode) {
        buttons.push(
          <Button
            key="cancel"
            variant="destructive"
            className="w-[50%]"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            key="update"
            variant="secondary"
            className="w-[50%]"
            size="sm"
            onClick={handleUpdate}
            disabled={!isFormDirty}
          >
            Update
          </Button>,
        );
      } else {
        buttons.push(
          <Button
            key="edit"
            variant="secondary"
            className="w-[50%]"
            size="sm"
            onClick={handleEdit}
          >
            Edit
          </Button>,
        );
      }
    }

    return { buttons, hasButtons: buttons.length > 0 };
  };

  const result = renderActionButtons();
  const buttons = result?.buttons ?? [];
  const hasButtons = result?.hasButtons ?? false;

  return (
    <div className="flex flex-col gap-6">
      {renderHeader?.(data)}

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col text-sm">
          <p>Id</p>
          <p className="text-muted-foreground">{data.id}</p>
        </div>
        <div className="flex flex-row gap-2">
          <CopyToClipboardButton text={data.id} />
          {queryKey === "trashbinManagement" && <ShowQrCode id={data.id} />}
        </div>
      </div>

      <Separator />

      {renderComponents(data)}

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground">Timestamps</p>
        <div className="grid grid-cols-2">
          <div className="flex flex-col text-sm">
            <p>Created At</p>
            <p className="text-muted-foreground">
              {formatDate(data.createdAt)}
            </p>
          </div>
          <div className="flex flex-col text-sm">
            <p>Last update</p>
            <p className="text-muted-foreground">
              {formatRelativeDate(data.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`
    flex flex-row items-center gap-2 w-full
    ${
      !enabledEditMode &&
      queryKey !== "activityManagement" &&
      queryKey !== "accessRequestsManagement"
        ? ""
        : ""
    }
    ${!hasButtons ? "-mb-5" : ""}
  `}
      >
        {buttons}
      </div>
    </div>
  );
}

export default function ViewContentLayout<
  T extends DataTimestamps & { id: string },
>(props: ViewContentLayoutProps<T>) {
  return <ViewContentLayoutComponent {...props} />;
}
