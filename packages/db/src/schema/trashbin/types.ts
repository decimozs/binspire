import type {
  trashbinsCollectionsTable,
  trashbinsStatusTable,
  trashbinsTable,
} from "./schema";
import z from "zod";
import type {
  insertTrashbinSchema,
  insertTrashbinCollectionSchema,
  updateTrashbinSchema,
  insertTrashbinStatusSchema,
  updateTrashbinStatusSchema,
  updateTrashbinCollectionSchema,
} from "./validators";

export type Trashbin = typeof trashbinsTable.$inferSelect;

export type TrashbinCollection = typeof trashbinsCollectionsTable.$inferSelect;

export type TrashbinStatus = typeof trashbinsStatusTable.$inferSelect;

export type InsertTrashbin = z.infer<typeof insertTrashbinSchema>;

export type InsertTrashbinStatus = z.infer<typeof insertTrashbinStatusSchema>;

export type InsertTrashbinCollection = z.infer<
  typeof insertTrashbinCollectionSchema
>;

export type UpdateTrashbin = z.infer<typeof updateTrashbinSchema>;

export type UpdateTrashbinStatus = z.infer<typeof updateTrashbinStatusSchema>;

export type UpdateTrashbinCollection = z.infer<
  typeof updateTrashbinCollectionSchema
>;
