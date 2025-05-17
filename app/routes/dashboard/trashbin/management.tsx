import { rpc } from "@/lib/rpc";
import type { Route } from "./+types/management";
import { useLoaderData } from "react-router";
import TrashbinsTable from "./_components/trashbins-table";
import type { Trashbin } from "@/lib/types";
import { parsedJSON } from "@/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const response = await rpc.trashbins.$get();
  if (!response.ok) throw new Error("Failed to get trashbins");
  const { data } = await response.json();
  const trashbins = parsedJSON<Trashbin[]>(data);

  return {
    trashbins,
  };
}

export async function action() {}

export default function TrashbinsManagementRoute() {
  const { trashbins } = useLoaderData<typeof loader>();
  return <TrashbinsTable data={trashbins} />;
}
