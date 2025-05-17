import {
  DirectionAction,
  type DirectionQueryArgs,
} from "@/action/directions.action";
import type { Route } from "./+types/directions.resource";
import { useFetcher } from "react-router";
import env from "@config/env.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const startCoordinates = searchParams.get("start") as string;
  const endCoordinates = searchParams.get("end") as string;
  const data: DirectionQueryArgs = {
    api_key: env?.ORS_API_KEY as string,
    start: startCoordinates,
    end: endCoordinates,
  };
  return await DirectionAction.getDirections(data);
}

export type DirectionsLoaderData = Awaited<ReturnType<typeof loader>>;

export async function action({ request }: Route.ActionArgs) {
  const data = await request.json();
  return await DirectionAction.getDirections(data);
}

export type DirectionActionData = Awaited<ReturnType<typeof action>>;

export const useGetDirectionFetcher = (intent: string) => {
  const fetcher = useFetcher({
    key: intent,
  });

  return {
    ...fetcher,
    submit: (data: DirectionQueryArgs) => {
      fetcher.submit({
        action: `/resources/directions`,
        method: "GET",
      });
    },
  };
};
