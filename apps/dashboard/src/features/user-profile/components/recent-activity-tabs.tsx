import type { User } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { History, ShieldQuestionMark } from "lucide-react";

interface Props {
  data: User;
}

export default function RecentActivityTabs({ data }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="font-medium text-2xl -mb-2">Recent Activity</p>
        <p className="text-muted-foreground">
          View recent activity details of the user.
        </p>
      </div>

      <div className="flex flex-row items-center gap-2 -mb-3">
        <Button
          variant={
            location.pathname === `/users/${data.id}` ? "default" : "outline"
          }
          className="border-dashed"
          size="sm"
          onClick={() =>
            navigate({
              to: "/users/$userId",
              params: { userId: data.id },
            })
          }
        >
          <History className="h-4 w-4" />
          History
        </Button>

        <Button
          variant={
            location.pathname === `/users/${data.id}/user-audit-logs`
              ? "default"
              : "outline"
          }
          className="border-dashed"
          size="sm"
          onClick={() =>
            navigate({
              to: "/users/$userId/user-audit-logs",
              params: { userId: data.id },
            })
          }
        >
          <ShieldQuestionMark className="h-4 w-4" />
          Audit
        </Button>
      </div>
    </>
  );
}
