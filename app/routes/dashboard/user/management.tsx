import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import UsersTable from "./_components/users-table";
import type { Route } from "./+types/management";
import db from "@/lib/db.server";
import { usersTable } from "@/db";
import { eq } from "drizzle-orm";

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
  const intent = formData.get("intent");

  if (intent === "update-user-permission") {
    const updatedPermission = formData.get("updated-permission");
    const [updateUser] = await db
      .update(usersTable)
      .set({
        permission: updatedPermission as string,
      })
      .where(eq(usersTable.id, userId))
      .returning();

    if (!updateUser) {
      return {
        errors: "Failed to update user permission",
      };
    }

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "delete") {
    const [deleteUser] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning();

    if (!deleteUser) {
      return {
        errors: "Failed to delete user.",
      };
    }

    return {
      success: true,
      intent: intent,
    };
  }
}

export default function UsersManagementRoute() {
  const { dehydratedState, getUsers } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersTable users={getUsers} />
    </HydrationBoundary>
  );
}
