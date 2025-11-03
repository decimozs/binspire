import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  status: number;

  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.status = StatusCodes.NOT_FOUND;
  }
}
