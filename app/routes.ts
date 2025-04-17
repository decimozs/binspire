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
    route("verification", "./routes/auth/verification/verification.tsx"),
    route("request-access", "./routes/auth/request-access/request-access.tsx"),
    route("reset-password", "./routes/auth/reset-password/reset-password.tsx"),
  ]),
  layout("./routes/dashboard/layout.tsx", [
    route("/dashboard", "./routes/dashboard/dashboard.tsx"),
  ]),
  route(
    "verification-successful",
    "./routes/auth/verification/success-verification.tsx",
  ),
  route(
    "verification-failed",
    "./routes/auth/verification/failed-verification.tsx",
  ),
] satisfies RouteConfig;
