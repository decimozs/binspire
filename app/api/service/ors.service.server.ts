import { ORSRepository } from "../repository/ors.repository.server";

async function getDirections(params: URLSearchParams) {
  return await ORSRepository.getDirections(params);
}

export const ORSService = {
  getDirections,
};
