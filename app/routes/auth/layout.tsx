import { Outlet } from "react-router";

export default function AuthLayoutPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block"></div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src="/logo.png" alt="logo" className="rounded-sm" />
            </div>
            Binspire
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}
