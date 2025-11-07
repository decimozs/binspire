import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  link: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function ServiceCard({ label, link, icon, onClick }: Props) {
  const Icon = icon;

  return (
    <div className="border-muted border-[1px] rounded-md p-4 cursor-pointer bg-muted">
      <Link to={link} onClick={onClick}>
        <div className="grid grid-cols-[30px_1fr] gap-4">
          <Icon size={30} />
          <p className="text-xl font-bold">{label}</p>
        </div>
      </Link>
    </div>
  );
}
