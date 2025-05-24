import AnalyticsCharts from "@/components/draggable/draggable-chart";
import { TrashbinQuery } from "@/query/trashbins.query";
import { getAllUsers } from "@/query/users.query.server";
import { useLoaderData } from "react-router";

export async function loader() {
  const users = await getAllUsers();
  const trashbins = await TrashbinQuery.getAllTrashbins();
  const collections = await TrashbinQuery.getAllTrashbinsCollection();
  const issues = await TrashbinQuery.getAllTrashbinsIssue();

  return {
    users,
    trashbins,
    collections,
    issues,
  };
}

export default function Analytics() {
  const { users, trashbins, collections, issues } =
    useLoaderData<typeof loader>();
  return (
    <AnalyticsCharts
      users={users}
      trashbins={trashbins.data}
      collections={collections.data}
      issues={issues.data}
    />
  );
}
