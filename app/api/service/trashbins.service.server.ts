import type {
  CreateTrashbinCollection,
  CreateTrashbinIssue,
  UpdateTrashbin,
  UpdateTrashbinCollection,
  UpdateTrashbinIssue,
} from "@/db";
import { TrashbinRepository } from "../repository/trashbins.repository.server";

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

async function getAllTrashbinsIssue() {
  return await TrashbinRepository.getAllTrashbinsIssue();
}

async function getAllTrashbinsCollection() {
  return await TrashbinRepository.getAllTrashbinsCollection();
}

async function getTrashbinIssueById(id: string) {
  return await TrashbinRepository.getTrashbinIssueById(id);
}

async function getTrashbinCollectionById(id: string) {
  return await TrashbinRepository.getTrashbinCollectionById(id);
}

async function deleteTrashbinIssue(id: string) {
  return await TrashbinRepository.deleteTrashbinIssue(id);
}

async function deleteTrashbinCollection(id: string) {
  return await TrashbinRepository.deleteTrashbinCollection(id);
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
  getAllTrashbinsIssue,
  getAllTrashbinsCollection,
  getTrashbinIssueById,
  getTrashbinCollectionById,
  deleteTrashbinIssue,
  deleteTrashbinCollection,
};
