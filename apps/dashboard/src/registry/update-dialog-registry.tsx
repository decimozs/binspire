import { UpdateEntity } from "@/components/entity/update-entity";

export default function UpdateDialogRegistry() {
  return (
    <>
      <UpdateEntity
        queryKey="trashbinManagement"
        formId={"trashbin-edit-form"}
      />
      <UpdateEntity queryKey="issueManagement" formId={"issue-edit-form"} />
    </>
  );
}
