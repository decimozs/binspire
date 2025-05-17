import type { GeoJSONData } from "@/lib/types";

async function getDirections(params: URLSearchParams): Promise<GeoJSONData> {
  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/driving-car?${params}`,
  );

  return response.json();
}

export const ORSRepository = {
  getDirections,
};
