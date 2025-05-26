import TrashbinsIssueTable from "./_components/trashbins-issue-table";
import { TrashbinQuery } from "@/query/trashbins.query";
import { useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/issues";
import { actionResponse } from "@/lib/utils";
import { rpc } from "@/lib/rpc";
import type { UpdateTrashbinIssue } from "@/db";

export async function loader() {
  return await TrashbinQuery.getAllTrashbinsIssue();
}

export async function action({ request }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { id, intent, data } = await request.json();

  switch (request.method) {
    case "PATCH": {
      const response = await rpc.trashbins.issues[":id"].update.$patch({
        param: {
          id: id,
        },
        json: data,
      });

      if (!response.ok) return actionResponse(false, intent);

      return actionResponse(true, intent);
    }
    case "DELETE": {
      const response = await rpc.trashbins.issues[":id"].delete.$delete({
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

export type TrashbinIssueActionData = Awaited<ReturnType<typeof action>>;

export const useUpdateTrashbinIssueFetcher = (intent: string) => {
  const fetcher = useFetcher({ key: intent });

  return {
    ...fetcher,
    submit: (id: string, data: UpdateTrashbinIssue) => {
      fetcher.submit(
        { id, intent, data },
        {
          action: "/dashboard/trashbin/issues",
          method: "PATCH",
          encType: "application/json",
        },
      );
    },
  };
};

export const deleteTrashbinIssueFetcher = (intent: string) => {
  const fetcher = useFetcher<TrashbinIssueActionData>({ key: intent });

  return {
    ...fetcher,
    submit: (id: string) => {
      fetcher.submit(
        { id },
        {
          action: "/dashboard/trashbin/issues",
          method: "DELETE",
          encType: "application/json",
        },
      );
    },
  };
};

export default function TrashbinsIssueRoute() {
  const { data: trashbinIssues } = useLoaderData<typeof loader>();
  return <TrashbinsIssueTable data={trashbinIssues} />;
}
