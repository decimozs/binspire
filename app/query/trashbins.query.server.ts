import { rpc } from "@/lib/rpc";
import type { Trashbin } from "@/lib/types";
import { parsedJSON } from "@/lib/utils";

async function getAllTrashbins() {
  const response = await rpc.trashbins.$get();

  if (!response.ok) throw new Error("Failed to get trashbins data");

  const { data } = await response.json();
  const trashbins = parsedJSON<Trashbin[]>(data);

  return {
    data: trashbins,
  };
}

async function getTrashbinById(id: string) {
  const response = await rpc.trashbins[":id"].$get({
    param: {
      id: id,
    },
  });

  if (!response.ok) throw new Error("Failed to get trashbin");

  const { data } = await response.json();
  const trashbin = parsedJSON<Trashbin>(data);

  return {
    data: trashbin,
  };
}

export const TrashbinQuery = {
  getAllTrashbins,
  getTrashbinById,
};
