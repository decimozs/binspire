import { getInitial } from "@binspire/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { Button } from "@binspire/ui/components/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export default function UserCard({
  id,
  name,
  email,
  image,
  label,
}: {
  id: string;
  name: string;
  email: string;
  image: string;
  label: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const sortParam = encodeURIComponent(
    JSON.stringify([{ id: "updatedAt", desc: true }]),
  );

  const handleViewUser = () => {
    navigate({ to: `/users/${id}?sort=${sortParam}`, params: { userId: id } });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        <p>{label}</p>
        {location.pathname !== `/users/${id}/user-audit-logs` && (
          <Button variant="outline" size="sm" onClick={handleViewUser}>
            View User
            <ArrowUpRight />
          </Button>
        )}
      </div>

      <div className="p-4 border-[1px] rounded-md px-4 py-3 border-dashed text-sm">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image || ""} />
            <AvatarFallback>{getInitial(name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
