import { logging } from "@binspire/logging";
import { Hono } from "hono";
import { except } from "hono/combine";
import type { AppBindings } from "@/lib/types";
import { corsMiddleware, sessionMiddleware } from "@/middlewares";
import {
  auditRoutes,
  authRoutes,
  backupRoutes,
  emailRoutes,
  historyRoutes,
  issueRoutes,
  maintenanceRoutes,
  messagingRoutes,
  organizationRoutes,
  organizationSettingsRoutes,
  qrCodeRoutes,
  sessionRoutes,
  trashbinCollectionRoutes,
  trashbinRoutes,
  trashbinStatusRoutes,
  userCollectionAssignmentRoutes,
  userGreenHeartRoutes,
  userInvitationRoutes,
  userQuotaRoutes,
  userRequestRoutes,
  userRoutes,
  userSettingsRoutes,
  userStatusRoutes,
  verificationRoutes,
} from "@/routes";
import { errorResponse } from "../error";

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
