import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import ActivityLogsTable from "./_components/activity-logs-table";
import type { Route } from "./+types/activity_logs";
import db from "@/lib/db.server";
import { userActivityTable } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const currentUser = session.get("userId");
  const username = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, currentUser as string),
  });

  const queryClient = new QueryClient();
  const { getActivityLogs } = await import("@/query/users.server");

  await queryClient.prefetchQuery({
    queryKey: ["users-activities"],
    queryFn: getActivityLogs,
  });

  return {
    dehydratedState: dehydrate(queryClient),
    getActivityLogs: await getActivityLogs(),
    username: username?.name,
  };
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
  const { username, getActivityLogs, dehydratedState } =
    useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ActivityLogsTable
        activities={getActivityLogs}
        username={username as string}
      />
    </HydrationBoundary>
  );
}
