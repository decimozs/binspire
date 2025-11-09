import { useLayout } from "@/store/layout-store";
import { Skeleton } from "@binspire/ui/components/skeleton";
import type { ComponentProps } from "react";

export default function LoaderLayout({ ...props }: ComponentProps<"div">) {
  const { layout } = useLayout();

  return (
    <main
      className={`flex flex-col gap-2 ${layout === "full" ? "" : "lg:w-[1400px]"}`}
      {...props}
    >
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-[600px]" />
      <Skeleton className="h-9" />
    </main>
  );
}
