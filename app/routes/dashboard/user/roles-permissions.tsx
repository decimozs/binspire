import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import RolesAndPermissionsTable from "./_components/roles-permissions-table";

export async function loader() {
  const queryClient = new QueryClient();
  const { getUsers } = await import("@/query/users.server");

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return {
    dehydratedState: dehydrate(queryClient),
    getUsers: await getUsers(),
  };
}

export default function UsersRolesPermissionsRoute() {
  const { dehydratedState, getUsers } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <RolesAndPermissionsTable users={getUsers} />
    </HydrationBoundary>
  );
}
