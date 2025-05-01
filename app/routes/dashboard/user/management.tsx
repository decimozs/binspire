import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import UsersTable from "./_components/users-table";
import type { Route } from "./+types/management";
import { userAction } from "@/action/user.server";

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

export async function action({ request }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const intent = formData.get("intent") as string;
  console.log("user management api hit");
  return await userAction(request, userId, intent, "user-management");
}

export default function UsersManagementRoute() {
  const { dehydratedState, getUsers } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersTable users={getUsers} />
    </HydrationBoundary>
  );
}
