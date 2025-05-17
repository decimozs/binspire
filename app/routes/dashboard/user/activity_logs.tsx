import { data, useLoaderData } from "react-router";
import ActivityLogsTable from "./_components/activity-logs-table";
import type { Route } from "./+types/activity_logs";
import db from "@/lib/db.server";
import { userActivityTable } from "@/db";
import { eq } from "drizzle-orm";
import { UserLoader } from "@/loader/users.server";

export async function loader() {
  return await UserLoader.activityLogs();
}

export async function action({ request }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = await request.formData();
  const intent = formData.get("intent");
  const activityId = formData.get("activityId");

  if (intent === "delete") {
    const [deleteActivity] = await db
      .delete(userActivityTable)
      .where(eq(userActivityTable.id, activityId as string))
      .returning();

    if (!deleteActivity) {
      return {
        errors: "Failed to delete activity",
      };
    }

    return {
      success: true,
      intent: intent,
    };
  }
}

export default function UserActivityLogsRoute() {
  const activityLogs = useLoaderData<typeof loader>();
  return <ActivityLogsTable data={activityLogs} />;
}
