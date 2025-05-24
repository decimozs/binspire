import {
  trashbinsCollectionTable,
  trashbinsIssueTable,
  trashbinsTable,
  type CreateTrashbinCollection,
  type CreateTrashbinIssue,
  type UpdateTrashbin,
  type UpdateTrashbinCollection,
  type UpdateTrashbinIssue,
} from "@/db";
import db from "@/lib/db.server";
import { eq } from "drizzle-orm";

function getAllTrashbins() {
  return db.query.trashbinsTable.findMany();
}

function getTrasbinById(id: string) {
  return db.query.trashbinsTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

function updateTrashbin(id: string, data: UpdateTrashbin) {
  return db
    .update(trashbinsTable)
    .set(data)
    .where(eq(trashbinsTable.id, id as string))
    .returning();
}

function deleteTrashbin(id: string) {
  return db.delete(trashbinsTable).where(eq(trashbinsTable.id, id)).returning();
}

function createTrashbinIssue(data: CreateTrashbinIssue) {
  return db.insert(trashbinsIssueTable).values(data).returning();
}

function updateTrashbinIssue(id: string, data: UpdateTrashbinIssue) {
  return db
    .update(trashbinsIssueTable)
    .set(data)
    .where(eq(trashbinsIssueTable.id, id));
}

function createTrashbinCollection(data: CreateTrashbinCollection) {
  return db.insert(trashbinsCollectionTable).values(data).returning();
}

function updateTrashbinCollection(id: string, data: UpdateTrashbinCollection) {
  return db
    .update(trashbinsCollectionTable)
    .set(data)
    .where(eq(trashbinsIssueTable.id, id));
}

function getAllTrashbinsIssue() {
  return db.query.trashbinsIssueTable.findMany({
    with: {
      trashbin: true,
      user: true,
    },
  });
}

function getAllTrashbinsCollection() {
  return db.query.trashbinsCollectionTable.findMany({
    with: {
      trashbin: true,
      user: true,
    },
  });
}

function getTrashbinIssueById(id: string) {
  return db.query.trashbinsIssueTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: {
      trashbin: true,
      user: true,
    },
  });
}

function getTrashbinCollectionById(id: string) {
  return db.query.trashbinsCollectionTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: {
      trashbin: true,
      user: true,
    },
  });
}

function deleteTrashbinIssue(id: string) {
  return db
    .delete(trashbinsIssueTable)
    .where(eq(trashbinsIssueTable.id, id))
    .returning();
}

function deleteTrashbinCollection(id: string) {
  return db
    .delete(trashbinsCollectionTable)
    .where(eq(trashbinsCollectionTable.id, id))
    .returning();
}

export const TrashbinRepository = {
  getAllTrashbins,
  getTrasbinById,
  updateTrashbin,
  deleteTrashbin,
  createTrashbinIssue,
  createTrashbinCollection,
  updateTrashbinCollection,
  updateTrashbinIssue,
  getAllTrashbinsIssue,
  getAllTrashbinsCollection,
  getTrashbinCollectionById,
  getTrashbinIssueById,
  deleteTrashbinCollection,
  deleteTrashbinIssue,
};
