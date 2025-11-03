import LoaderLayout from "@/components/layout/loader-layout";
import UserHistoryDataTable from "@/features/user-profile/components/user-history-data-table";
import { queryOptions, UserApi, useSuspenseQuery } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/$userId/")({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["user", params.userId],
        queryFn: () => UserApi.getById(params.userId),
      }),
    ),
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  const { data: user } = useSuspenseQuery(
    queryOptions({
      queryKey: ["user", userId],
      queryFn: () => UserApi.getById(userId),
    }),
  );

  return <UserHistoryDataTable data={user.history} />;
}
