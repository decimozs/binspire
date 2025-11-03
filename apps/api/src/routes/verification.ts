import VerificationHandler from "@/handlers/verification";
import { factory } from "@/lib/factory";

const handler = new VerificationHandler();

export const verificationRoutes = factory
  .createApp()
  .post("/verify-identifier", ...handler.verifyIdentifier)
  .post("/verify", ...handler.verify)
  .post("/create", ...handler.create)
  .delete("/delete/:id", ...handler.delete);
