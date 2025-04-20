import { Link, Outlet } from "react-router";

export default function AuthLayoutPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="/cover-banner.png"
          alt="cover-banner"
          className="w-full h-screen object-none object-[0_100%] p-4"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
