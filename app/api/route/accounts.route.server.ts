import { factory } from "@/lib/utils";
import { AccountController } from "../controller/accounts.controller.server";

const accountRoutes = factory
  .createApp()
  .get("/accounts/:id", ...AccountController.getAccountById)
  .get("/accounts/provider/:id", ...AccountController.getAccountByProviderId)
  .get("/accounts/account/:id", ...AccountController.getAccountByAccountId)
  .post("/accounts/create", ...AccountController.createAccount)
  .patch(
    "/accounts/:id/:providerId/update",
    ...AccountController.updateAccount,
  );

export default accountRoutes;
