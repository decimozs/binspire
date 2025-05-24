import { factory } from "@/lib/utils";
import { AuthController } from "../controller/auth.controller.server";
import { googleLoginAuth } from "@/lib/auth.server";

const authRoutes = factory
  .createApp()
  .get("/auth/google/login", googleLoginAuth, ...AuthController.loginWithGoogle)
  .get("/login", ...AuthController.loginWithEmailAndPassword);

export default authRoutes;
