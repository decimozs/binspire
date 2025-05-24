import { TrashbinController } from "../controller/trashbins.controller.server";
import { factory } from "@/lib/utils";

const trashbinRoutes = factory
  .createApp()
  .get("/trashbins", ...TrashbinController.getAllTrashbins)
  .get(
    "/trashbins/collections",
    ...TrashbinController.getAllTrashbinsCollection,
  )
  .get("/trashbins/issues", ...TrashbinController.getAllTrashbinsIssue)
  .post("/trashbins/create-issue", ...TrashbinController.createTrashbinIssue)
  .post(
    "/trashbins/create-collection",
    ...TrashbinController.createTrashbinCollection,
  )
  .get("/trashbins/:id", ...TrashbinController.getTrashbinById)
  .get(
    "/trashbins/collections/:id",
    ...TrashbinController.getTrashbinCollectionById,
  )
  .get("/trashbins/issues/:id", ...TrashbinController.getTrashbinsIssueById)
  .patch("/trashbins/:id", ...TrashbinController.updateTrashbin)
  .patch(
    "/trashbins/issues/:id/update",
    ...TrashbinController.updateTrashbinIssue,
  )
  .patch(
    "/trashbins/collections/:id/update",
    ...TrashbinController.updateTrashbinCollection,
  )
  .delete("/trashbins/:id", ...TrashbinController.deleteTrashbin)
  .delete(
    "/trashbins/issues/:id/delete",
    ...TrashbinController.deleteTrashbinIssue,
  )
  .delete(
    "/trashbins/collections/:id/delete",
    ...TrashbinController.deleteTrashbinCollection,
  );

export default trashbinRoutes;
