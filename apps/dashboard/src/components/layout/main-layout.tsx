import { useLayout } from "@/store/layout-store";
import type { ComponentProps, ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

type Props = MainLayoutProps & ComponentProps<"div">;

export default function MainLayout({
  children,
  title,
  description,
  ...props
}: Props) {
  const { layout } = useLayout();

  return (
    <main
      className={`flex flex-col gap-2 ${layout === "full" ? "" : "w-[1400px]"}`}
      {...props}
    >
      <p className="text-3xl font-semibold">{title}</p>
      <p className="text-muted-foreground">{description}</p>
      {children}
    </main>
  );
}
