import { Skeleton } from "@binspire/ui/components/skeleton";
import type { ComponentProps } from "react";

export default function LoaderLayout({ ...props }: ComponentProps<"div">) {
  return (
    <main className="w-full h-full grid grid-cols-1 gap-4" {...props}>
      <Skeleton className="h-[56px] w-full" />
      <Skeleton className="h-[56px] w-full" />
      <Skeleton className="h-[56px] w-full" />
      <Skeleton className="h-[56px] w-full" />
    </main>
  );
}
