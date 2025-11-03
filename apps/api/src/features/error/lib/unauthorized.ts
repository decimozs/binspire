import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends Error {
  status: number;

  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
