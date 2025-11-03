import { factory } from "@/lib/factory";
import { MaintenanceHandler } from "@/handlers";

export const maintenanceRoutes = factory
  .createApp()
  .get("/", ...new MaintenanceHandler().findAll)
  .get("/:id", ...new MaintenanceHandler().findById)
  .post("/create", ...new MaintenanceHandler().create)
  .patch("/update/:id", ...new MaintenanceHandler().update)
  .delete("/delete/:id", ...new MaintenanceHandler().delete);
