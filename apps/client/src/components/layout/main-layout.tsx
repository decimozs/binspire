import { Skeleton } from "@binspire/ui/components/skeleton";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { motionVariants } from "@/lib/motion";

export default function MainLayout({
  children,
  ...props
}: { children: ReactNode } & ComponentProps<"div">) {
  const location = useLocation();
  const routerState = useRouterState();
  const isPending = routerState.status === "pending";
  const pathname = location.pathname;

  let content: ReactNode;

  if (isPending) {
    if (pathname === "/map") {
      content = (
        <main className="flex items-center justify-center h-[80vh] w-full">
          <Loader2 className="animate-spin" />
        </main>
      );
    } else if (pathname === "/activity") {
      content = (
        <main className="w-full grid grid-cols-1 gap-4 h-full" {...props}>
          <Skeleton className="w-full h-[82px]" />
          <Skeleton className="w-full h-[82px]" />
          <Skeleton className="w-full h-[82px]" />
          <Skeleton className="w-full h-[82px]" />
          <Skeleton className="w-full h-[82px]" />
        </main>
      );
    } else if (pathname === "/") {
      content = (
        <main className="w-full grid grid-cols-1 gap-4 h-full" {...props}>
          <Skeleton className="w-full h-[150px]" />
          <Skeleton className="w-full h-[56px]" />
          <Skeleton className="w-full h-[400px]" />
          <Skeleton className="w-full h-[56px]" />
        </main>
      );
    } else {
      content = (
        <main className="w-full grid grid-cols-1 gap-4 h-full" {...props}>
          <Skeleton className="w-full h-[56px]" />
          <Skeleton className="w-full h-[56px]" />
          <Skeleton className="w-full h-[56px]" />
        </main>
      );
    }
  } else {
    content = (
      <main className="w-full grid grid-cols-1 gap-4 h-full mb-16" {...props}>
        {children}
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={motionVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ type: "tween", ease: "anticipate", duration: 0.4 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
