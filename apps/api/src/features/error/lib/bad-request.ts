import { StatusCodes } from "http-status-codes";
import type { ZodIssue } from "zod/v4";

export class BadRequestError extends Error {
  status: number;

  constructor(message = "Bad request", cause: ZodIssue[]) {
    super(message);
    this.name = "BadRequestError";
    this.cause = cause.toString();
    this.status = StatusCodes.BAD_REQUEST;
  }
}
