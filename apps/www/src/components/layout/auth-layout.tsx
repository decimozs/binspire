import { useIsMobile } from "@binspire/ui/hooks/use-mobile";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BackgroundRippleEffect } from "../ui/background-ripple-effect";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <BackgroundRippleEffect rows={isMobile ? 5 : 10} />
      <main className="h-screen w-full flex items-center justify-center">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          className="fixed top-4 left-4 z-50"
        >
          Back
        </Button>
        <div className="z-50">{children}</div>
      </main>
    </>
  );
}
