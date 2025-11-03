import DeleteEntity from "@/components/entity/delete-entity";
import {
  useDeleteAudit,
  useDeleteHistory,
  useDeleteIssue,
  useDeleteTrashbin,
  useDeleteTrashbinCollection,
  useDeleteUser,
  useDeleteUserGreenHeart,
  useDeleteUserInvitation,
  useDeleteUserRequest,
} from "@binspire/query";

export default function DeleteDialogRegistry() {
  return (
    <>
      <DeleteEntity queryKey="userManagement" useDeleteHook={useDeleteUser} />
      <DeleteEntity
        queryKey="trashbinManagement"
        useDeleteHook={useDeleteTrashbin}
      />
      <DeleteEntity
        queryKey="collectionsManagement"
        useDeleteHook={useDeleteTrashbinCollection}
      />
      <DeleteEntity
        queryKey="activityManagement"
        useDeleteHook={useDeleteAudit}
      />
      <DeleteEntity
        queryKey="historyManagement"
        useDeleteHook={useDeleteHistory}
      />
      <DeleteEntity queryKey="issueManagement" useDeleteHook={useDeleteIssue} />
      <DeleteEntity
        queryKey="accessRequestsManagement"
        useDeleteHook={useDeleteUserRequest}
      />
      <DeleteEntity
        queryKey="invitationsManagement"
        useDeleteHook={useDeleteUserInvitation}
      />
      <DeleteEntity
        queryKey="greenHeartsManagement"
        useDeleteHook={useDeleteUserGreenHeart}
      />
    </>
  );
}
