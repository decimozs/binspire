import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormHeader } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import type { requestAccessTable } from "@/db";
import { CircleCheck, Phone, Mail } from "lucide-react";

type User = typeof requestAccessTable.$inferSelect;

interface ConfirmAccountProps {
  user: User;
  onConfirm: () => void;
}

export default function ConfirmAccount({
  user,
  onConfirm,
}: ConfirmAccountProps) {
  return (
    <div className="flex w-md flex-col gap-6">
      <FormHeader
        title="Create your account"
        description="You're approved! Confirm your details below to complete your signup and get started."
      />
      <div className="grid gap-6">
        <div>
          <Label htmlFor="user-info" className="text-sm font-medium">
            Personal Information
          </Label>
          <div
            className="text-sm border-[1px] border-input p-4 rounded-md my-2 grid grid-cols-[70px_1fr]"
            id="user-info"
          >
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage alt="@shadcn" />
              <AvatarFallback>
                {
                  user.name
                    .split(" ")
                    .map((point) => point[0])
                    .join("") as string
                }
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <p className="text-lg">{user.name}</p>
                <Badge className="capitalize">{user.role}</Badge>
              </div>
              <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                <Mail size={15} className="mt-[0.1rem]" />
                {user.email}
              </p>
              <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                <Phone size={15} className="mt-[0.1rem]" />
                {user.phoneNumber}
              </p>
            </div>
          </div>
        </div>
        <Button type="button" className="w-full h-12 p-4" onClick={onConfirm}>
          <CircleCheck className="mr-2 h-4 w-4" />
          Confirm
        </Button>
      </div>
    </div>
  );
}
