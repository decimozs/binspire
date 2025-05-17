import { TrashbinController } from "../controller/trashbins.server";
import { factory } from "@/lib/utils";

const trashbinRoutes = factory
  .createApp()
  .get("/trashbins", ...TrashbinController.getAllTrashbins)
  .post("/trashbins/create-issue", ...TrashbinController.createTrashbinIssue)
  .post(
    "/trashbins/create-collection",
    ...TrashbinController.createTrashbinCollection,
  )
  .get("/trashbins/:id", ...TrashbinController.getTrashbinById)
  .patch("/trashbins/:id", ...TrashbinController.updateTrashbin)
  .patch(
    "/trashbins/:id/update-issue",
    ...TrashbinController.updateTrashbinIssue,
  )
  .patch(
    "/trashbins/:id/update-collection",
    ...TrashbinController.updateTrashbinCollection,
  )
  .delete("/trashbins/:id", ...TrashbinController.deleteTrashbin);

export default trashbinRoutes;
