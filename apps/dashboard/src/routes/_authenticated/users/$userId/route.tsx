import { queryOptions, UserApi, useSuspenseQuery } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import UserProfile from "@/features/user-profile";

export const Route = createFileRoute("/_authenticated/users/$userId")({
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

  return <UserProfile data={user} />;
}
