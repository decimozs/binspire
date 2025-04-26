import { fallbackInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserConfirmation = ({
  name,
  image,
  role,
}: {
  name: string;
  image: string;
  role: string;
}) => {
  return (
    <div className="bg-muted/50 border-input border-dashed border-[1px] rounded-md p-4">
      <div className="flex flex-row gap-2">
        <Avatar className="h-[50px] w-[50px]">
          <AvatarImage src={image} />
          <AvatarFallback>{fallbackInitials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <p>{name}</p>
          <p className="capitalize text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

const UserAccessRequestConfirmation = ({
  name,
  role,
}: {
  name: string;
  role: string;
}) => {
  return (
    <div className="bg-muted/50 border-input border-dashed border-[1px] rounded-md p-4">
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
  );
};

export { UserConfirmation, UserAccessRequestConfirmation };
