import { useEffect, useState } from "react";
import Dashboard from "@/features/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import {
  AuditApi,
  HistoryApi,
  IssueApi,
  queryOptions,
  TrashbinApi,
  TrashbinCollectionsApi,
  UserApi,
  UserInvitationsApi,
  UserRequestApi,
  useSuspenseQuery,
} from "@binspire/query";
import LoaderLayout from "@/components/layout/loader-layout";
import { Bot, X } from "lucide-react";
import Welcome from "@/components/core/welcome";
import { cn } from "@binspire/ui/lib/utils";

const routeQueryOpts = queryOptions({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const [
      users,
      collections,
      issues,
      audits,
      trashbins,
      invitations,
      requests,
      history,
    ] = await Promise.all([
      UserApi.getAll(),
      TrashbinCollectionsApi.getAll(),
      IssueApi.getAll(),
      AuditApi.getAll(),
      TrashbinApi.getAll(),
      UserInvitationsApi.getAll(),
      UserRequestApi.getAll(),
      HistoryApi.getAll(),
    ]);

    return {
      users,
      collections,
      issues,
      audits,
      trashbins,
      invitations,
      requests,
      history,
    };
  },
});

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(routeQueryOpts),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(routeQueryOpts);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem("binspireAI_banner_dismissed");
    if (!hasDismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem("binspireAI_banner_dismissed", "true");
  };

  return (
    <>
      <Welcome />
      {showBanner && (
        <div
          className={cn(
            "text-center rounded-md border-[1px] py-4 px-2 mb-4 relative transition-all animate-in fade-in overflow-hidden text-white",
            "bg-gradient-to-r from-blue-500 via-emerald-500 to-primary",
            "bg-[length:200%_200%] animate-gradient-move",
            "hover:opacity-95 border-secondary",
          )}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <Bot className="text-white" />
            <p className="text-xl font-bold">Binspire AI is now available</p>
          </div>
          <p className="mt-2">
            Say hello to your personal data companion! Instantly chat, discover
            insights, and analyze waste management data like never before.
            <span className="font-semibold">
              Try it now and experience smarter sustainability.
            </span>
          </p>
          <X
            onClick={handleClose}
            className="absolute top-3 right-3 cursor-pointer hover:text-white/80 transition-colors"
            size={16}
          />
        </div>
      )}
      <Dashboard data={data} />
    </>
  );
}
