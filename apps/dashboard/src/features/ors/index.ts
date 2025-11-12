import { OpenRouteService } from "ors-client";

export const ors = new OpenRouteService({
  apiKey: import.meta.env.VITE_ORS_API_KEY,
});
