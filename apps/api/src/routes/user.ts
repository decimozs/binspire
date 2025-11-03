import {
  UserHandler,
  UserInvitationHandler,
  UserRequestHandler,
  UserSettingsHandler,
  UserStatusHandler,
  UserCollectionAssignmentHandler,
  UserQuotaHandler,
  UserGreenHeartHandler,
} from "@/handlers";
import { factory } from "@/lib/factory";

const userHandler = new UserHandler();
const userInvitationHandler = new UserInvitationHandler();
const userRequestHandler = new UserRequestHandler();
const userSettingsHandler = new UserSettingsHandler();
const userStatusHandler = new UserStatusHandler();
const userCollectionAssignmentHandler = new UserCollectionAssignmentHandler();
const userQuotaHandler = new UserQuotaHandler();
const userGreenHeartHandler = new UserGreenHeartHandler();

export const userRoutes = factory
  .createApp()
  .get("/", ...userHandler.findAll)
  .get("/:id", ...userHandler.findById)
  .get("/email/:id", ...userHandler.findByEmail)
  .post("/create", ...userHandler.create)
  .patch("/update/:id", ...userHandler.update)
  .delete("/delete/:id", ...userHandler.delete);

export const userInvitationRoutes = factory
  .createApp()
  .get("/", ...userInvitationHandler.findAll)
  .get("/:id", ...userInvitationHandler.findById)
  .post("/create", ...userInvitationHandler.create)
  .patch("/update/:id", ...userInvitationHandler.update)
  .delete("/delete/:id", ...userInvitationHandler.delete);

export const userRequestRoutes = factory
  .createApp()
  .get("/", ...userRequestHandler.findAll)
  .get("/:id", ...userRequestHandler.findById)
  .post("/create", ...userRequestHandler.create)
  .patch("/update/:id", ...userRequestHandler.update)
  .delete("/delete/:id", ...userRequestHandler.delete);

export const userSettingsRoutes = factory
  .createApp()
  .get("/", ...userSettingsHandler.findAll)
  .get("/:id", ...userSettingsHandler.findByUserId)
  .post("/create", ...userSettingsHandler.create)
  .patch("/update/:id", ...userSettingsHandler.update)
  .delete("/delete/:id", ...userSettingsHandler.delete);

export const userStatusRoutes = factory
  .createApp()
  .get("/", ...userStatusHandler.findAll)
  .get("/:id", ...userStatusHandler.findByUserId)
  .post("/create", ...userStatusHandler.create)
  .patch("/update/:id", ...userStatusHandler.update)
  .delete("/delete/:id", ...userStatusHandler.delete);

export const userCollectionAssignmentRoutes = factory
  .createApp()
  .get("/", ...userCollectionAssignmentHandler.findAll)
  .get("/userId/:id", ...userCollectionAssignmentHandler.findByUserId)
  .get("/:id", ...userCollectionAssignmentHandler.findById)
  .post("/create", ...userCollectionAssignmentHandler.create)
  .delete("/delete/:id", ...userCollectionAssignmentHandler.delete);

export const userQuotaRoutes = factory
  .createApp()
  .get("/", ...userQuotaHandler.findAll)
  .get("/userId/:id", ...userQuotaHandler.findByUserId)
  .get("/:id", ...userQuotaHandler.findById)
  .post("/create", ...userQuotaHandler.create)
  .patch("/update/:id", ...userQuotaHandler.update)
  .delete("/delete/:id", ...userQuotaHandler.delete);

export const userGreenHeartRoutes = factory
  .createApp()
  .get("/", ...userGreenHeartHandler.findAll)
  .get("/userId/:id", ...userGreenHeartHandler.findByUserId)
  .get("/:id", ...userGreenHeartHandler.findById)
  .post("/create", ...userGreenHeartHandler.create)
  .patch("/update/:id", ...userGreenHeartHandler.update)
  .delete("/delete/:id", ...userGreenHeartHandler.delete);
