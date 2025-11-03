import { OrganizationHandler, OrganizationSettingsHandler } from "@/handlers";
import { factory } from "@/lib/factory";

const orgHandler = new OrganizationHandler();
const orgSettingsHandler = new OrganizationSettingsHandler();

export const organizationRoutes = factory
  .createApp()
  .get("/", ...orgHandler.findAll)
  .get("/:id", ...orgHandler.findById)
  .post("/create/", ...orgHandler.create)
  .patch("/update/:id", ...orgHandler.update)
  .delete("/delete/:id", ...orgHandler.delete);

export const organizationSettingsRoutes = factory
  .createApp()
  .get("/", ...orgSettingsHandler.findAll)
  .get("/:id", ...orgSettingsHandler.findByOrgId)
  .post("/create/", ...orgSettingsHandler.create)
  .patch("/update/:id", ...orgSettingsHandler.update)
  .patch("/update-secret/:id", ...orgSettingsHandler.updateSecret)
  .delete("/delete/:id", ...orgSettingsHandler.delete);
