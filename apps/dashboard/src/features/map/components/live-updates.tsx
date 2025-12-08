import { useGetUserSettingsByUserId } from "@binspire/query";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { authClient } from "@/lib/auth-client";
import { useRealtimeUpdatesStore } from "@/store/realtime-store";

export default function LiveUpdates() {
  const session = authClient.useSession();
  const currentUser = session.data?.user;
  const { data: settings } = useGetUserSettingsByUserId(
    currentUser?.id as string,
  );

  const currentSettings = settings?.settings;

  const updates = useRealtimeUpdatesStore((state) => state.updates);

  if (!currentSettings?.appearance.liveUpdatesOnMap) return null;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-sm font-semibold red-badge w-fit">Live Updates</h1>
      <ScrollArea className="relative text-xs overflow-y-auto h-[400px] pr-4">
        <div className="space-y-2">
          {updates.length === 0 && (
            <p className="text-muted-foreground">No recent updates.</p>
          )}
          {updates.map((update, index) => (
            <div
              key={index}
              className="animate-fadeIn transition-all duration-700"
            >
              {update.msg}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
