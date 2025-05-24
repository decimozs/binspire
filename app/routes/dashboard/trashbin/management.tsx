import { useLoaderData, useRouteLoaderData } from "react-router";
import TrashbinsTable from "./_components/trashbins-table";
import { TrashbinLoader } from "@/loader/trashbins.loader.server";

export async function loader() {
  return await TrashbinLoader.trashbinManagement();
}

export default function TrashbinsManagementRoute() {
  const { trashbins } = useLoaderData<typeof loader>();
  console.log(trashbins.data);
  return <TrashbinsTable data={trashbins.data} />;
}
