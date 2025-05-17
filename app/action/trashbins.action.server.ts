import type {
  CreateTrashbinCollection,
  CreateTrashbinIssue,
  UpdateTrashbin,
  UpdateTrashbinCollection,
  UpdateTrashbinIssue,
} from "@/db";
import { rpc } from "@/lib/rpc";
import { actionResponse } from "@/lib/utils";

async function createIssue(intent: string, data: CreateTrashbinIssue) {
  try {
    await rpc.trashbins["create-issue"].$post({
      json: data,
    });

    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

async function createTrashbinCollection(
  intent: string,
  data: CreateTrashbinCollection,
) {
  try {
    await rpc.trashbins["create-collection"].$post({
      json: data,
    });
    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

async function updateTrashbinCollection(
  intent: string,
  id: string,
  data: UpdateTrashbinCollection,
) {
  try {
    await rpc.trashbins[":id"]["update-collection"].$patch({
      param: {
        id: id,
      },
      json: data,
    });
    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

async function updateTrashbinIssue(
  intent: string,
  id: string,
  data: UpdateTrashbinIssue,
) {
  try {
    await rpc.trashbins[":id"]["update-issue"].$patch({
      param: {
        id: id,
      },
      json: data,
    });
    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

async function update(
  intent: string,
  id: string,
  userId: string,
  data: UpdateTrashbin,
) {
  try {
    const response = await rpc.trashbins[":id"].$patch({
      param: { id: id },
      json: data,
    });

    if (response.ok) {
      if (intent === "collect-trashbin") {
        const updatedTrashbin = await response.json();
        await createTrashbinCollection(intent, {
          userId: userId,
          trashbinId: updatedTrashbin.data.id,
          status: "Successfull",
        });
      }
    }

    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

async function remove(intent: string, id: string) {
  try {
    await rpc.trashbins[":id"].$delete({
      param: { id: id },
    });
    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

export const TrashbinAction = {
  createIssue,
  update,
  remove,
  createTrashbinCollection,
  updateTrashbinIssue,
  updateTrashbinCollection,
};
