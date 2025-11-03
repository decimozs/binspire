import { StatusCodes } from "http-status-codes";

export class ConflictError extends Error {
  status: number;

  constructor(message = "Resource already exists") {
    super(message);
    this.name = "ConflictError";
    this.status = StatusCodes.CONFLICT;
  }
}
