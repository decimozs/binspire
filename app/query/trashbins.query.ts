import { rpc } from "@/lib/rpc";
import type { Trashbin, TrashbinCollection, TrashbinIssue } from "@/lib/types";
import { parsedJSON } from "@/lib/utils";

async function getAllTrashbins() {
  const response = await rpc.trashbins.$get();

  if (!response.ok) throw new Error("Failed to get trashbins data");

  const { data } = await response.json();
  const trashbins = parsedJSON<Trashbin[]>(data);

  return {
    data: trashbins,
  };
}

async function getTrashbinById(id: string) {
  const response = await rpc.trashbins[":id"].$get({
    param: {
      id: id,
    },
  });

  if (!response.ok) throw new Error("Failed to get trashbin");

  const { data } = await response.json();
  const trashbin = parsedJSON<Trashbin>(data);

  return {
    data: trashbin,
  };
}

async function getAllTrashbinsIssue() {
  const response = await rpc.trashbins.issues.$get();

  if (!response.ok) throw new Error("Failed to get trashbins issues");

  const { data } = await response.json();
  const trashbinsIssue = parsedJSON<TrashbinIssue>(data);

  return {
    data: trashbinsIssue,
  };
}

async function getAllTrashbinsCollection() {
  const response = await rpc.trashbins.collections.$get();

  if (!response.ok) throw new Error("Failed to get trashbins collections");

  const { data } = await response.json();
  const trashbinsCollection = parsedJSON<TrashbinCollection>(data);

  return {
    data: trashbinsCollection,
  };
}

async function getTrashbinIssueById(id: string) {
  const response = await rpc.trashbins.issues[":id"].$get({
    param: {
      id: id,
    },
  });

  if (!response.ok) throw new Error("Failed to get trashbin issues");

  const { data } = await response.json();
  const trashbinIssues = parsedJSON<TrashbinIssue[number]>(data);

  return {
    data: trashbinIssues,
  };
}

async function getTrashbhinCollectionById(id: string) {
  const response = await rpc.trashbins.collections[":id"].$get({
    param: {
      id: id,
    },
  });

  if (!response.ok) throw new Error("Failed to get trashbin collections");

  const { data } = await response.json();
  const trashbinCollections = parsedJSON<TrashbinCollection[number]>(data);

  return {
    data: trashbinCollections,
  };
}

export const TrashbinQuery = {
  getAllTrashbins,
  getTrashbinById,
  getAllTrashbinsIssue,
  getAllTrashbinsCollection,
  getTrashbinIssueById,
  getTrashbhinCollectionById,
};
