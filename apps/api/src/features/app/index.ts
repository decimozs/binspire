import { Hono } from "hono";
import type { AppBindings } from "@/lib/types";
import { logging } from "@binspire/logging";
import { errorResponse } from "../error";
import { corsMiddleware, sessionMiddleware } from "@/middlewares";
import {
  auditRoutes,
  authRoutes,
  backupRoutes,
  emailRoutes,
  historyRoutes,
  issueRoutes,
  maintenanceRoutes,
  organizationRoutes,
  organizationSettingsRoutes,
  qrCodeRoutes,
  sessionRoutes,
  trashbinCollectionRoutes,
  trashbinRoutes,
  trashbinStatusRoutes,
  userCollectionAssignmentRoutes,
  userInvitationRoutes,
  userRequestRoutes,
  userRoutes,
  userSettingsRoutes,
  userStatusRoutes,
  userQuotaRoutes,
  userGreenHeartRoutes,
  verificationRoutes,
  messagingRoutes,
} from "@/routes";
import { except } from "hono/combine";

const app = new Hono<AppBindings>({ strict: false })
  .basePath("/v1/api")
  .use("*", corsMiddleware)
  .use("*", except(["/"], sessionMiddleware))
  .use(logging())
  .onError((err, c) => {
    return errorResponse(c, err);
  })
  .get("/", (c) => {
    return c.text("Welcome to Binspire API");
  })
  .route("/messaging", messagingRoutes)
  .route("/auth", authRoutes)
  .route("/sessions", sessionRoutes)
  .route("/audits", auditRoutes)
  .route("/emails", emailRoutes)
  .route("/users", userRoutes)
  .route("/users-settings", userSettingsRoutes)
  .route("/users-status", userStatusRoutes)
  .route("/users-invitations", userInvitationRoutes)
  .route("/users-requests", userRequestRoutes)
  .route("/users-quota", userQuotaRoutes)
  .route("/users-greenhearts", userGreenHeartRoutes)
  .route("/users-collection-assignments", userCollectionAssignmentRoutes)
  .route("/trashbins", trashbinRoutes)
  .route("/trashbins-status", trashbinStatusRoutes)
  .route("/trashbins-collections", trashbinCollectionRoutes)
  .route("/organizations", organizationRoutes)
  .route("/organizations-settings", organizationSettingsRoutes)
  .route("/verifications", verificationRoutes)
  .route("/history", historyRoutes)
  .route("/issues", issueRoutes)
  .route("/backups", backupRoutes)
  .route("/qr-code", qrCodeRoutes)
  .route("/maintenance", maintenanceRoutes);

export default app;
