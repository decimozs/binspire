import { createInsertSchema } from "drizzle-zod";
import {
  trashbinsCollectionsTable,
  trashbinsStatusTable,
  trashbinsTable,
} from "./schema";
import { insertExcludedFields } from "../../lib/base";

export const insertTrashbinSchema = createInsertSchema(trashbinsTable)
  .omit(insertExcludedFields)
  .strict();

export const insertTrashbinStatusSchema = createInsertSchema(
  trashbinsStatusTable,
)
  .omit(insertExcludedFields)
  .strict();

export const insertTrashbinCollectionSchema = createInsertSchema(
  trashbinsCollectionsTable,
)
  .omit(insertExcludedFields)
  .strict();

export const updateTrashbinSchema = insertTrashbinSchema.partial();

export const updateTrashbinStatusSchema = insertTrashbinStatusSchema.partial();

export const updateTrashbinCollectionSchema =
  insertTrashbinCollectionSchema.partial();
