import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  description: string;
  icon: LucideIcon;
}

export default function SettingsItem({ label, description, icon }: Props) {
  const Icon = icon as LucideIcon;

  return (
    <div className="text-left flex flex-row items-start gap-4">
      <div className="border-accent border-[1px] rounded-md p-2 mt-1">
        <Icon size={30} />
      </div>
      <div>
        <p>{label}</p>
        <p className="mt-1 text-muted-foreground leading-4 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
