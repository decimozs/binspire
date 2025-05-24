import { TrashbinQuery } from "@/query/trashbins.query";

async function trashbinManagement() {
  const trashbins = await TrashbinQuery.getAllTrashbins();
  const trashbinsIssue = await TrashbinQuery.getAllTrashbinsIssue();
  const trashbinsCollection = await TrashbinQuery.getAllTrashbinsCollection();

  return {
    trashbins,
    trashbinsIssue,
    trashbinsCollection,
  };
}

export const TrashbinLoader = {
  trashbinManagement,
};
