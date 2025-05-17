import { data, useLoaderData } from "react-router";
import RolesAndPermissionsTable from "./_components/roles-permissions-table";
import type { Route } from "./+types/roles-permissions";
import { userAction } from "@/action/user.server";
import { UserLoader } from "@/loader/users.server";

export async function loader() {
  return await UserLoader.rolesAndPermissions();
}

export async function action({ request }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const intent = formData.get("intent") as string;
  const currentPermission = formData.get("currentPermission") as string;
  const updatedPermission = formData.get("updated-permission") as string;
  const permissionData = {
    currentPermission: currentPermission,
    updatedPermission: updatedPermission,
  };

  return await userAction(
    request,
    userId,
    intent,
    "roles-permissions",
    permissionData,
  );
}

export default function UsersRolesPermissionsRoute() {
  const users = useLoaderData<typeof loader>();
  return <RolesAndPermissionsTable data={users} />;
}
