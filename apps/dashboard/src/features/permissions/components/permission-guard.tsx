import type { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
}

export function PermissionGuard({ children }: PermissionGuardProps) {
  return <>{children}</>;
}
