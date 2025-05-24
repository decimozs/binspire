import { TrashbinQuery } from "@/query/trashbins.query";
import { useFetcher, useLoaderData } from "react-router";
import TrashbinsCollectionTable from "./_components/trashbins-collection-table";
import type { Route } from "./+types/collection";
import { rpc } from "@/lib/rpc";
import { actionResponse } from "@/lib/utils";

export async function loader() {
  return await TrashbinQuery.getAllTrashbinsCollection();
}

export async function action({ request }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { id, intent, data } = await request.json();

  switch (request.method) {
    case "DELETE": {
      const response = await rpc.trashbins.collections[":id"].delete.$delete({
        param: {
          id: id,
        },
      });

      if (!response.ok) return actionResponse(false, intent);

      return actionResponse(true, intent);
    }
    default:
      return actionResponse(false, "Invalid request method");
  }
}

export type TrashbinCollectionActionData = Awaited<ReturnType<typeof action>>;

export const useDeleteTrashbinCollectionFetcher = (intent: string) => {
  const fetcher = useFetcher({ key: intent });

  return {
    ...fetcher,
    submit: (id: string) => {
      fetcher.submit(
        { id, intent },
        {
          action: "/dashboard/trashbin/collections",
          method: "DELETE",
          encType: "application/json",
        },
      );
    },
  };
};

export default function TrashbinsCollectionRoute() {
  const { data: trashbinCollections } = useLoaderData<typeof loader>();
  return <TrashbinsCollectionTable data={trashbinCollections} />;
}
