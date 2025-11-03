import {
  TrashbinCollectionHandler,
  TrashbinHandler,
  TrashbinStatusHandler,
} from "@/handlers";
import { factory } from "@/lib/factory";

const trashbinHandler = new TrashbinHandler();
const trashbinCollectionHandler = new TrashbinCollectionHandler();
const trashbinStatusHandler = new TrashbinStatusHandler();

export const trashbinRoutes = factory
  .createApp()
  .get("/", ...trashbinHandler.findAll)
  .get("/:id", ...trashbinHandler.findById)
  .post("/create", ...trashbinHandler.create)
  .post("/collect/:id", ...trashbinHandler.collect)
  .patch("/update/:id", ...trashbinHandler.update)
  .delete("/delete/:id", ...trashbinHandler.delete);

export const trashbinCollectionRoutes = factory
  .createApp()
  .get("/", ...trashbinCollectionHandler.findAll)
  .get("/:id", ...trashbinCollectionHandler.findById)
  .get("/trashbin/:id", ...trashbinCollectionHandler.findByTrashbinId)
  .get("/user/:id", ...trashbinCollectionHandler.findByUserId)
  .post("/create", ...trashbinCollectionHandler.create)
  .patch("/update/:id", ...trashbinCollectionHandler.update)
  .delete("/delete/:id", ...trashbinCollectionHandler.delete);

export const trashbinStatusRoutes = factory
  .createApp()
  .get("/", ...trashbinStatusHandler.findAll)
  .get("/:id", ...trashbinStatusHandler.findByTrashbinId)
  .post("/create", ...trashbinStatusHandler.create)
  .patch("/update/:id", ...trashbinStatusHandler.update)
  .delete("/delete/:id", ...trashbinStatusHandler.delete);
