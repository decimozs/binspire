import { data, useLoaderData } from "react-router";
import UsersTable from "./_components/users-table";
import type { Route } from "./+types/management";
import { userAction } from "@/action/user.action.server";
import { UserLoader } from "@/loader/users.loader.server";

export async function loader() {
  return await UserLoader.management();
}

export async function action({ request }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const intent = formData.get("intent") as string;
  return await userAction(request, userId, intent, "user-management");
}

export default function UsersManagementRoute() {
  const users = useLoaderData<typeof loader>();
  return <UsersTable data={users} />;
}
