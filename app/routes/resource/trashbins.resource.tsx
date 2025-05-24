import { TrashbinQuery } from "@/query/trashbins.query";
import type { Route } from "./+types/trashbins.resource";
import { TrashbinAction } from "@/action/trashbins.action.server";
import type { CreateTrashbinIssue, UpdateTrashbin } from "@/db";
import { useFetcher, type ShouldRevalidateFunction } from "react-router";
import { actionResponse } from "@/lib/utils";
import { getSession } from "@/lib/sessions.server";

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false;
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const id = params.id;
  const trashbin = await TrashbinQuery.getTrashbinById(id);

  if (!trashbin.data) throw new Error("Failed to get trashbin");

  return {
    data: trashbin.data,
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const session = await getSession(request.headers.get("cookie"));
  const currentUserId = session.get("userId") as string;
  const id = params.id;
  const { intent, data } = await request.json();

  switch (request.method) {
    case "POST":
      return TrashbinAction.createIssue(intent, data);
    case "PATCH":
      return TrashbinAction.update(intent, id, currentUserId, data);
    case "DELETE":
      return TrashbinAction.remove(intent, id);
    default:
      return actionResponse(false, "Invalid request method");
  }
}

export type TrashbinActionData = Awaited<ReturnType<typeof action>>;

export const useCreateTrashbinIssueFetcher = (intent: string, id: string) => {
  const fetcher = useFetcher({
    key: intent,
  });

  return {
    ...fetcher,
    submit: (data: CreateTrashbinIssue) => {
      fetcher.submit(
        { intent, data },
        {
          action: `/resources/trashbins/${id}`,
          method: "POST",
          encType: "application/json",
        },
      );
    },
  };
};

export const useUpdateTrashbinFetcher = (intent: string, id: string) => {
  const fetcher = useFetcher({
    key: intent,
  });

  return {
    ...fetcher,
    submit: (data: UpdateTrashbin) => {
      fetcher.submit(
        { intent, data },
        {
          action: `/resources/trashbins/${id}`,
          method: "PATCH",
          encType: "application/json",
        },
      );
    },
  };
};

export const useDeleteTrashbinFetcher = (intent: string, id: string) => {
  const fetcher = useFetcher({
    key: intent,
  });

  return {
    ...fetcher,
    submit: () => {
      fetcher.submit(
        { intent },
        {
          action: `/resources/trashbins/${id}`,
          method: "DELETE",
          encType: "application/json",
        },
      );
    },
  };
};
