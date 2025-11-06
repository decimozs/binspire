import { Button } from "@binspire/ui/components/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@binspire/ui/components/card";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  label: string;
  analyticsLink: string;
}

export default function MetricCard({
  title,
  description,
  label,
  icon: Icon,
  analyticsLink,
}: Props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate({ to: analyticsLink });
  };

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardAction>
            <Icon size={20} className="text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="relative">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold text-primary">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-fit absolute right-6 top-6 hover:text-primary transition-transform duration-200 hover:scale-150"
              onClick={handleNavigate}
            >
              <ArrowUpRight />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
