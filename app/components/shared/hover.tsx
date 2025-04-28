import { fallbackInitials, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { DynamicActiveBadge } from "./dynamic-badge";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ArrowUpRight, Calendar, Mail, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import type { User } from "@/lib/types";

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

export { UserHoverCard };
