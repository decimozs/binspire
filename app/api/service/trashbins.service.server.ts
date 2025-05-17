import type {
  CreateTrashbinCollection,
  CreateTrashbinIssue,
  UpdateTrashbin,
  UpdateTrashbinCollection,
  UpdateTrashbinIssue,
} from "@/db";
import { TrashbinRepository } from "../repository/trashbins.server";

async function getAllTrashbins() {
  return await TrashbinRepository.getAllTrashbins();
}

async function getTrashbinById(id: string) {
  const trashbin = await TrashbinRepository.getTrasbinById(id);
  if (!trashbin) throw new Error("Trashbin not found");
  return trashbin;
}

async function updateTrashbin(id: string, data: UpdateTrashbin) {
  return await TrashbinRepository.updateTrashbin(id, data);
}

async function deleteTrashbin(id: string) {
  await getTrashbinById(id);
  return await TrashbinRepository.deleteTrashbin(id);
}

async function createTrashbinIssue(data: CreateTrashbinIssue) {
  return await TrashbinRepository.createTrashbinIssue(data);
}

async function updateTrashbinIssue(id: string, data: UpdateTrashbinIssue) {
  return await TrashbinRepository.updateTrashbinIssue(id, data);
}

async function createTrashbinCollection(data: CreateTrashbinCollection) {
  return await TrashbinRepository.createTrashbinCollection(data);
}

async function updateTrashbinCollection(
  id: string,
  data: UpdateTrashbinCollection,
) {
  return await TrashbinRepository.updateTrashbinCollection(id, data);
}

export const TrashbinService = {
  getAllTrashbins,
  getTrashbinById,
  updateTrashbin,
  deleteTrashbin,
  createTrashbinIssue,
  updateTrashbinIssue,
  updateTrashbinCollection,
  createTrashbinCollection,
};
