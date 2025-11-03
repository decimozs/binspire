import { Card, CardFooter, CardHeader } from "@binspire/ui/components/card";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
}

export default function HelpCard({ title, icon: Icon }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Card className="cursor-pointer">
        <CardHeader>
          <Icon size={20} className="text-muted-foreground" />
        </CardHeader>
        <CardFooter className="text-lg">{title}</CardFooter>
      </Card>
    </div>
  );
}
