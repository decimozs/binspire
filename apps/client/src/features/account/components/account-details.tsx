import { useSession } from "@/features/auth";
import { useGetOrganizationById } from "@binspire/query";
import { Skeleton } from "@binspire/ui/components/skeleton";

function AccountDetailsItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  );
}

export default function AccountDetails() {
  const { data: currentSession, isPending: isSessionPending } = useSession();
  const { data: org, isPending: isOrgPending } = useGetOrganizationById(
    currentSession?.user.orgId || "",
  );

  if (!currentSession || isSessionPending || isOrgPending || !org) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="w-full h-[52px]" />
        <Skeleton className="w-full h-[52px]" />
        <Skeleton className="w-full h-[52px]" />
      </div>
    );
  }

  const user = currentSession.user;

  return (
    <div className="grid grid-cols-1 gap-4">
      <AccountDetailsItem label="Name" value={user.name} />
      <AccountDetailsItem label="Email" value={user.email} />
      <AccountDetailsItem label="Organization" value={org.name} />
    </div>
  );
}
