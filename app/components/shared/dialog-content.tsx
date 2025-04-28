import type { RequestAccess, User, UserActivities } from "@/lib/types";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { FetcherWithComponents } from "react-router";
import { ArrowDown, ArrowRight, Loader2 } from "lucide-react";
import {
  UserConfirmation,
  UserAccessRequestConfirmation,
} from "./user-confirmation";
import SelectAccessControl from "@/routes/dashboard/user/_components/select-access-control";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { fallbackInitials } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface UserDialogProps {
  data: User;
  fetcher: FetcherWithComponents<any>;
}

interface UpdateUserPermissionProps extends UserDialogProps {
  updatedPermission: string;
  setUpdatedPermission: (value: string) => void;
}

const UpdateUserPermissionContent = ({
  data,
  fetcher,
  updatedPermission,
  setUpdatedPermission,
}: UpdateUserPermissionProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update user permissions?</DialogTitle>
        <DialogDescription>
          You're about to change this user's access rights within the system.
        </DialogDescription>
      </DialogHeader>
      <UserConfirmation
        name={data.name}
        image={data.image as string}
        role={data.role}
      />
      <div className="flex flex-row justify-between items-center">
        <SelectAccessControl
          title="Current Permission"
          selectedAccess={data.permission}
          disabled={true}
        />
        <ArrowRight size={17} className="text-muted-foreground mt-7" />
        <SelectAccessControl
          title="Change Permission"
          selectedAccess={updatedPermission}
          setSelectedAccess={setUpdatedPermission}
        />
      </div>
      <DialogDescription>
        These changes will take effect immediately and may impact what the user
        can view or do.
      </DialogDescription>
      <DialogFooter>
        <fetcher.Form method="POST" action="/dashboard/user/management">
          <input type="hidden" name="userId" value={data.id} />
          <input type="hidden" name="intent" value="update-user-permission" />
          <input
            type="hidden"
            name="updated-permission"
            value={updatedPermission}
          />
          <Button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </fetcher.Form>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

const DeleteUserContent = ({ data, fetcher }: UserDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this user?</DialogTitle>
        <DialogDescription>
          You're about to permanently remove this user from the system.
        </DialogDescription>
      </DialogHeader>
      <UserConfirmation
        name={data.name}
        image={data.image as string}
        role={data.role}
      />
      <DialogDescription>
        This action is irreversible and the user's data will no longer be
        accessible. Proceed with caution.
      </DialogDescription>
      <DialogFooter>
        <fetcher.Form method="POST" action="/dashboard/user/management">
          <input type="hidden" name="userId" value={data.id} />
          <input type="hidden" name="intent" value="delete" />
          <Button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </fetcher.Form>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

interface UserAccessRequestProps extends Omit<UserDialogProps, "data"> {
  data: RequestAccess;
}

const DeleteUserAccessRequestContent = ({
  data,
  fetcher,
}: UserAccessRequestProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete user access request?</DialogTitle>
        <DialogDescription>
          You're about to permanently remove this user access request from the
          system.
        </DialogDescription>
      </DialogHeader>
      <UserAccessRequestConfirmation name={data.name} role={data.role} />
      <DialogDescription>
        This action cannot be undone. This will permanently remove this user's
        access request from the system.
      </DialogDescription>
      <DialogFooter>
        <fetcher.Form method="POST">
          <input type="hidden" name="requestId" value={data.id} />
          <input type="hidden" name="intent" value="delete" />
          <Button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </fetcher.Form>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

interface UserApproveAccessRequestProps extends UserAccessRequestProps {
  selectedAccess: string;
  setSelectedAccess: (value: string) => void;
}

const ApproveUserAccessRequestContent = ({
  data,
  fetcher,
  selectedAccess,
  setSelectedAccess,
}: UserApproveAccessRequestProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Approve user access request?</DialogTitle>
        <DialogDescription>
          You're about to approve this user access request from the system.
        </DialogDescription>
      </DialogHeader>
      <UserAccessRequestConfirmation name={data.name} role={data.role} />
      <DialogDescription>
        This user will be granted access to the platform. You can’t undo this
        action after confirming.
      </DialogDescription>
      <div className="flex flex-row justify-between">
        {data.role === "admin" && (
          <SelectAccessControl
            selectedAccess={selectedAccess}
            setSelectedAccess={setSelectedAccess}
          />
        )}
        <DialogFooter
          className={`mt-auto ${data.role === "collector" ? "ml-auto" : ""}`}
        >
          <fetcher.Form method="POST">
            <input type="hidden" name="requestId" value={data.id} />
            <input type="hidden" name="intent" value="approved" />
            <input type="hidden" name="email" value={data.email} />
            <input type="hidden" name="access-control" value={selectedAccess} />
            <Button type="submit" disabled={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Approving...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </fetcher.Form>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

const RejectUserAccessRequestContent = ({
  data,
  fetcher,
}: UserAccessRequestProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject user access request?</DialogTitle>
        <DialogDescription>
          You're about to reject this user access request from the system.
        </DialogDescription>
      </DialogHeader>
      <UserAccessRequestConfirmation name={data.name} role={data.role} />
      <DialogDescription>
        This user’s request will be denied. You can’t undo this action after
        confirming.
      </DialogDescription>
      <DialogFooter>
        <fetcher.Form method="POST">
          <input type="hidden" name="requestId" value={data.id} />
          <input type="hidden" name="intent" value="rejected" />
          <input type="hidden" name="email" value={data.email} />
          <Button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin" />
                Rejecting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </fetcher.Form>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

interface UserActivityProps extends Omit<UserDialogProps, "data"> {
  activityId: string;
  name: string;
  role: string;
  title: string;
  action: string;
  description: string;
}

const DeleteUserActivityContent = ({
  activityId,
  fetcher,
  name,
  role,
  title,
  action,
  description,
}: UserActivityProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete activity?</DialogTitle>
        <DialogDescription>
          You're about to delete this user activity from the system.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="bg-muted/50 border-input border-dashed border-[1px] rounded-md p-4 w-full">
          <div className="flex flex-row gap-2">
            <Avatar className="h-[50px] w-[50px]">
              <AvatarImage alt={name} />
              <AvatarFallback>{fallbackInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p>{name}</p>
              <p className="capitalize text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
        <ArrowDown size={17} className="text-muted-foreground" />
        <div className="bg-muted/50 border-input border-dashed border-[1px] rounded-md p-4 w-full">
          <div className="flex flex-row gap-2">
            <Avatar className="h-[50px] w-[50px]">
              <AvatarImage alt={name} />
              <AvatarFallback>{fallbackInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <p>{title}</p>
                <Badge variant="default" className="capitalize">
                  {action}
                </Badge>
              </div>
              <p className="capitalize text-sm text-muted-foreground w-72">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <DialogDescription>
        This activity will be deleted. You can’t undo this action after
        confirming.
      </DialogDescription>
      <DialogFooter>
        <fetcher.Form method="POST" action="/dashboard/user/activity-logs">
          <input type="hidden" name="activityId" value={activityId} />
          <input type="hidden" name="intent" value="delete" />
          <Button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </fetcher.Form>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export {
  DeleteUserContent,
  UpdateUserPermissionContent,
  DeleteUserAccessRequestContent,
  ApproveUserAccessRequestContent,
  RejectUserAccessRequestContent,
  DeleteUserActivityContent,
};
