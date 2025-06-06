import { fallbackInitials, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { DynamicActionBadge, DynamicActiveBadge } from "./dynamic-badge";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  ArrowRight,
  ArrowUpRight,
  Battery,
  Calendar,
  CircleDashed,
  Clock,
  Mail,
  UsersRound,
  Weight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";
import type {
  Action,
  ActivityLog,
  Permission,
  User,
  ActivityLogs,
  Trashbin,
} from "@/lib/types";
import { actionIcons, permissionIcons } from "@/lib/constants";
import { useQueryState } from "nuqs";
import { useNavigateStore } from "@/store/navigate.store";

const UserHoverCard = ({ data }: { data: User }) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <span className="flex flex-row items-center gap-2">
          <Avatar>
            <AvatarImage src={data.image as string} alt={data.name} />
            <AvatarFallback>{fallbackInitials(data.name)}</AvatarFallback>
          </Avatar>
          {data.name}
        </span>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <div className="flex flex-col gap-2">
          <DynamicActiveBadge isOnline={data.isOnline} />
          <div className="flex flex-row items-center justify-between">
            <p>{data.name}</p>
            <Badge className="capitalize">{data.permission}</Badge>
          </div>
          <Separator />
          <div>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground capitalize">
              <UsersRound size={15} className="mt-[0.1rem]" />
              {data.role}
            </p>
            <p className="text-sm flex flex-row gap-2 text-muted-foreground w-fit wrap-anywhere">
              <Mail size={15} className="mt-[0.2rem]" />
              {data.email}
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
              <Calendar size={15} className="mt-[0.1rem]" />
              Joined on {formatDate(data.createdAt as Date)}
            </p>
          </div>
          <Link
            to={`/dashboard/user/management/profile/${data.id}`}
            prefetch="intent"
          >
            <Button variant="secondary" className="w-full">
              <ArrowUpRight size={15} className="mt-[0.1rem]" />
              Profile
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const ActionDescriptionHoverCard = ({
  data,
  onReviewClick,
}: {
  data: ActivityLogs[number];
  onReviewClick: () => void;
}) => {
  const PermissionIcon =
    permissionIcons[data.content?.updatedPermisson as Permission];
  const ActionIcon = actionIcons[data?.action as Action];
  return (
    <HoverCard>
      <HoverCardTrigger>
        <span className="flex flex-row items-center gap-2">
          <DynamicActionBadge action={data.action as Action} />
          {data.description}
        </span>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <Badge className="capitalize">
              {data.action === "sign-up" ? "Sign up" : data.action}
            </Badge>
            <p className="text-sm">{formatDate(data.createdAt)}</p>
          </div>
          <Separator />
          <div className="flex flex-row justify-center items-center my-4">
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage
                src={data.content?.modifiedUserImage}
                alt={data.action}
              />
              <AvatarFallback>
                {data.content?.modifiedUserImage as string}
              </AvatarFallback>
            </Avatar>
            <ArrowRight size={17} className="mx-4 text-muted-foreground" />
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage src={data.action as string} alt={data.action} />
              <AvatarFallback>
                {PermissionIcon && <PermissionIcon className="h-6 w-6" />}
                {ActionIcon && <ActionIcon className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-center">Commit changes by</p>
            <div className="flex flex-row items-center gap-2 p-2 rounded-md border-input border-dashed border-[1px]">
              <Avatar>
                <AvatarImage
                  src={data.user.image as string}
                  alt={data.user.name}
                />
                <AvatarFallback>
                  {fallbackInitials(data.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-row items-center justify-between w-full ">
                <p className="text-sm">{data.user.name}</p>
                <Badge className="capitalize">{data.user.role}</Badge>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onReviewClick}
          >
            <ArrowUpRight size={15} className="mt-[0.1rem]" />
            Review
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const TrashbinHoverCard = ({ data }: { data: Trashbin }) => {
  const navigate = useNavigate();
  const {
    setStartLatLang,
    setEndLatLang,
    setRouteDirection,
    setTrashbinId,
    reset,
  } = useNavigateStore();
  const handleNavigateTrashbin = (
    start: [number, number],
    end: [number, number],
  ) => {
    reset();
    setStartLatLang(start.toString());
    setEndLatLang(end.toString());
    setRouteDirection("true");
    setTrashbinId(data.id);
    navigate("/dashboard?navigate_to=true");
  };

  return (
    <HoverCard>
      <HoverCardTrigger>{data.name}</HoverCardTrigger>
      <HoverCardContent align="start">
        <div className="flex flex-col gap-2">
          <DynamicActiveBadge isOnline={data.isActive} />
          <div className="flex flex-row items-center justify-between">
            <p>{data.name}</p>
            <Badge className="capitalize">{data.isCollected}</Badge>
          </div>
          <Separator />
          <div>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground capitalize">
              <CircleDashed size={15} className="mt-[0.1rem]" />
              {data.wasteLevel}%
            </p>
            <p className="text-sm flex flex-row gap-2 text-muted-foreground w-fit wrap-anywhere">
              <Weight size={15} className="mt-[0.2rem]" />
              {data.weightLevel}%
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
              <Battery size={15} className="mt-[0.1rem]" />
              {data.batteryLevel}%
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
              <Clock size={15} className="mt-[0.1rem]" />
              Last collected on {formatDate(data.createdAt as Date)}
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() =>
              handleNavigateTrashbin(
                [121.07544884155124, 14.577870676283723],
                [Number(data.longitude), Number(data.latitude)],
              )
            }
          >
            <ArrowUpRight size={15} className="mt-[0.1rem]" />
            Navigate
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export { UserHoverCard, ActionDescriptionHoverCard, TrashbinHoverCard };
