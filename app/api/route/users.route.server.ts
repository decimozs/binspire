import { UserController } from "../controller/users.controller.server";
import { factory } from "@/lib/utils";

const userRoutes = factory
  .createApp()
  .get("/users", ...UserController.getAllUsers)
  .get("/users/activity-logs", ...UserController.getAllActivityLogs)
  .get("/users/access-requests", ...UserController.getAllAccessRequests)
  .get("/users/comments", ...UserController.getAllComments)
  .get("/users/:id", ...UserController.getUserById)
  .get(
    "/users/activity-logs/by-id/:id",
    ...UserController.getAllActivityLogsById,
  )
  .get(
    "/users/activity-logs/by-user/:id",
    ...UserController.getAllActivityLogsByUserId,
  )
  .patch("/users/:id/update", ...UserController.updateUser);

export default userRoutes;
