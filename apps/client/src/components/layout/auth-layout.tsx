import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <main className="h-screen w-full flex items-center justify-center">
      {children}
    </main>
  );
}
