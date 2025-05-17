import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("./routes/auth/layout.tsx", [
    route("login", "./routes/auth/login/login.tsx"),
    route("sign-up", "./routes/auth/sign-up/sign-up.tsx"),
    route("verification", "./routes/auth/verification/verification.tsx"),
    route("request-access", "./routes/auth/request-access/request-access.tsx"),
    route("reset-password", "./routes/auth/reset-password/reset-password.tsx"),
  ]),
  layout("./routes/dashboard/layout.tsx", [
    route("/dashboard", "./routes/dashboard/dashboard.tsx"),
    route(
      "/dashboard/user/access-requests",
      "./routes/dashboard/user/access-request.tsx",
    ),
    route(
      "/dashboard/user/management",
      "./routes/dashboard/user/management.tsx",
    ),
    route(
      "/dashboard/user/management/profile/:userId",
      "./routes/dashboard/user/profile/user-profile.tsx",
    ),
    route(
      "/dashboard/user/roles-permissions",
      "./routes/dashboard/user/roles-permissions.tsx",
    ),
    route(
      "/dashboard/user/activity-logs",
      "./routes/dashboard/user/activity_logs.tsx",
    ),
    route(
      "/dashboard/trashbin/management",
      "./routes/dashboard/trashbin/management.tsx",
    ),
    route(
      "/dashboard/trashbin/issues",
      "./routes/dashboard/trashbin/issues.tsx",
    ),
    route("/dashboard/trashbin/tasks", "./routes/dashboard/trashbin/tasks.tsx"),
    route(
      "/dashboard/trashbin/collections",
      "./routes/dashboard/trashbin/collection.tsx",
    ),
  ]),
  route("callback", "./routes/auth/sign-up/callback.tsx"),
  route("logout", "./routes/auth/logout.tsx"),
  route("resources/trashbins/:id", "./routes/resource/trashbins.resource.tsx"),
  route("resources/directions", "./routes/resource/directions.resource.tsx"),
] satisfies RouteConfig;
