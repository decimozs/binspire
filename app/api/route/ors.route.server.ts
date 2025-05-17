import { factory } from "@/lib/utils";
import { ORSController } from "../controller/ors.controller.server";

const orsRoutes = factory
  .createApp()
  .get("/ors/directions", ...ORSController.getDirections);

export default orsRoutes;
