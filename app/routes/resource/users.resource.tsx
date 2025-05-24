import { actionResponse } from "@/lib/utils";
import type { Route } from "./+types/users.resource";
import { UserAction } from "@/action/user.action.server";
import { useFetcher } from "react-router";
import type { UpdateUser } from "@/db";

export async function action({ request, params }: Route.ActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const requestMethod = request.method;
  const id = params.id;
  const { intent, data } = await request.json();

  switch (requestMethod) {
    case "PATCH": {
      return await UserAction.updateUser(intent, id, data);
    }
    default:
      return actionResponse(false, "Invalid request method");
  }
}

export type UserActionData = Awaited<ReturnType<typeof action>>;

export const updateUserFetcher = (intent: string, id: string) => {
  const fetcher = useFetcher<UserActionData>({
    key: intent,
  });

  return {
    ...fetcher,
    submit: (data: UpdateUser) => {
      fetcher.submit(
        { intent, data },
        {
          action: `/resources/users/${id}`,
          method: "PATCH",
          encType: "application/json",
        },
      );
    },
  };
};
