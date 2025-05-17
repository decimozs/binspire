import { rpc } from "@/lib/rpc";
import { actionResponse } from "@/lib/utils";

export interface DirectionQueryArgs {
  api_key: string;
  start: string;
  end: string;
}

async function getDirections(args: DirectionQueryArgs) {
  try {
    const response = await rpc.ors.directions.$get({
      query: args,
    });

    if (!response.ok) throw new Error("Failed to get directions");

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
    };
  }
}

export const DirectionAction = {
  getDirections,
};
