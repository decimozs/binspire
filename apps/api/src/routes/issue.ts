import { IssueHandler } from "@/handlers";
import { factory } from "@/lib/factory";

const handler = new IssueHandler();

export const issueRoutes = factory
  .createApp()
  .get("/", ...handler.findAll)
  .get("/:id", ...handler.findById)
  .post("/create", ...handler.create)
  .patch("/update/:id", ...handler.update)
  .delete("/delete/:id", ...handler.delete);
