import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import ActivityLogsTable from "./_components/activity-logs-table";

export async function loader() {
  const queryClient = new QueryClient();
  const { getActivityLogs } = await import("@/query/users.server");

  await queryClient.prefetchQuery({
    queryKey: ["users-activities"],
    queryFn: getActivityLogs,
  });

  return {
    dehydratedState: dehydrate(queryClient),
    getActivityLogs: await getActivityLogs(),
  };
}

export default function UserActivityLogsRoute() {
  const { getActivityLogs, dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ActivityLogsTable activities={getActivityLogs} />
    </HydrationBoundary>
  );
}
