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
    route("/dashboard/analytics", "./routes/dashboard/analytics.tsx"),
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
    route(
      "/dashboard/trashbin/collections",
      "./routes/dashboard/trashbin/collection.tsx",
    ),
    layout("./routes/dashboard/setting/layout.tsx", [
      route(
        "/dashboard/settings/general",
        "./routes/dashboard/setting/general.tsx",
      ),
      route(
        "/dashboard/settings/appearance",
        "./routes/dashboard/setting/appearance.tsx",
      ),
      route(
        "/dashboard/settings/backup",
        "./routes/dashboard/setting/backup.tsx",
      ),
      route(
        "/dashboard/settings/about",
        "./routes/dashboard/setting/about.tsx",
      ),
    ]),
  ]),
  route("callback", "./routes/auth/sign-up/callback.tsx"),
  route("logout", "./routes/auth/logout.tsx"),
  route("resources/trashbins/:id", "./routes/resource/trashbins.resource.tsx"),
  route("resources/directions", "./routes/resource/directions.resource.tsx"),
  route("resources/users/:id", "./routes/resource/users.resource.tsx"),
] satisfies RouteConfig;
