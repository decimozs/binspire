import { AuditHandler } from "@/handlers/audit";
import { factory } from "@/lib/factory";

const handler = new AuditHandler();

export const auditRoutes = factory
  .createApp()
  .get("/", ...handler.findAll)
  .get("/:id", ...handler.findById)
  .post("/create", ...handler.create)
  .patch("/update/:id", ...handler.update)
  .delete("/delete/:id", ...handler.delete);
