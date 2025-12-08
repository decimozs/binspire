import { UserInvitationsApi } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import AuthLayout from "@/components/layout/auth-layout";
import { SubLogo } from "@/components/logo";

const routeSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute("/download-client/")({
  component: RouteComponent,
  validateSearch: routeSchema,
  loaderDeps: ({ search: { id } }) => ({ id }),
  loader: async ({ deps: { id } }) => {
    if (!id) throw redirect({ to: "/" });

    const invitation = await UserInvitationsApi.getById(id);

    if (!invitation) throw redirect({ to: "/" });

    return { invitation };
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <div className="grid grid-cols-1 gap-4 w-screen px-4 md:w-md">
        <div className="flex flex-col items-center gap-3 mb-4">
          <SubLogo />
          <p className="text-4xl text-center">Start helping your community</p>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xl text-muted-foreground">
            Download our client to continue
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-left">For android</p>
            <a href="/android-release.apk" download>
              <Button className="w-full">Download for Android</Button>
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <p className="text-left">For iOS</p>
              <p className="orange-badge">Upcoming!</p>
            </div>
            <a href="/app-release.apk" aria-disabled>
              <Button className="w-full" disabled>
                Download for iOS
              </Button>
            </a>
          </div>
        </div>
        <p className="text-center">
          Already installed?{" "}
          <span>
            <a href="/app" className="text-primary">
              Open the app
            </a>
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
