import type { z } from "zod";
import type {
  accountsTable,
  qrCodesTable,
  sessionsTable,
  verificationsTable,
} from "./schema";
import type {
  insertAccountSchema,
  insertQrCodeSchema,
  insertSessionSchema,
  insertVerificationSchema,
  updateAccountSchema,
  updateQrCodeSchema,
  updateSessionSchema,
  updateVerificationSchema,
} from "./validators";

export type Session = typeof sessionsTable.$inferSelect;

export type Account = typeof accountsTable.$inferSelect;

export type Verification = typeof verificationsTable.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;

export type InsertSession = z.infer<typeof insertSessionSchema>;

export type InsertVerification = z.infer<typeof insertVerificationSchema>;

export type UpdateSession = z.infer<typeof updateSessionSchema>;

export type UpdateAccount = z.infer<typeof updateAccountSchema>;

export type UpdateVerification = z.infer<typeof updateVerificationSchema>;

export type QrCode = typeof qrCodesTable.$inferSelect;

export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;

export type UpdateQrCode = z.infer<typeof updateQrCodeSchema>;
