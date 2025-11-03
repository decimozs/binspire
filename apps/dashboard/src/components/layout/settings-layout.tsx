import { Separator } from "@binspire/ui/components/separator";
import type { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
  label: string;
  description: string;
}

export default function SettingsLayout({
  children,
  label,
  description,
}: SettingsLayoutProps) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <p className="text-xl font-medium">{label}</p>
      <p className="text-muted-foreground">{description}</p>
      <Separator className="my-2" />
      {children}
    </div>
  );
}
