import ViewAudit from "@/features/audits/components/view-audit";
import ViewHistory from "@/features/history/components/view-history";
import CreateIssue from "@/features/issues/components/create-issue";
import ViewIssue from "@/features/issues/components/view-issue";
import GenerateKeySecret from "@/features/settings/components/key-secret";
import ViewTrashbinCollection from "@/features/trashbin-collections/components/view-trashbin-collection";
import ViewTrashbin from "@/features/trashbins/components/view-trashbin";
import InviteUser from "@/features/user-invitations/components/invite-user";
import ViewInvitation from "@/features/user-invitations/components/view-invitation";
import ViewRequests from "@/features/user-requests/components/view-requests";
import ViewReviewChanges from "./view-review-changes";

export default function ViewsContainer() {
  return (
    <>
      <ViewTrashbinCollection />
      <ViewTrashbin />
      <ViewAudit />
      <ViewHistory />
      <ViewInvitation />
      <ViewReviewChanges />
      <ViewIssue />
      <ViewRequests />
      <CreateIssue />
      <InviteUser />
      <GenerateKeySecret />
    </>
  );
}
