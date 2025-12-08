import { AuthHandler, QrCodeHandler } from "@/handlers";
import { factory } from "@/lib/factory";

export const authRoutes = factory
  .createApp()
  .on(["POST", "GET"], "*", ...AuthHandler.betterAuth);

export const qrCodeRoutes = factory
  .createApp()
  .get("/", ...new QrCodeHandler().findAll)
  .get("/secret/:id", ...new QrCodeHandler().findBySecret)
  .get("/:id", ...new QrCodeHandler().findById)
  .post("/create", ...new QrCodeHandler().create)
  .patch("/update/:id", ...new QrCodeHandler().update)
  .delete("/delete/:id", ...new QrCodeHandler().delete);
