import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import { formatDistanceToNow } from "date-fns";
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import superjson from "superjson";
import { createFactory, createMiddleware } from "hono/factory";
import type { APIBindings } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFieldError<T extends string>(
  errors: unknown,
  field: T,
): string | undefined {
  if (
    typeof errors !== "string" &&
    typeof errors === "object" &&
    errors !== null &&
    field in errors
  ) {
    const err = (errors as Record<T, string[]>)[field];
    return err?.[0];
  }
  return undefined;
}

export function hashUrlToken(token: string, salt: string | null) {
  const combined = token + salt;
  const hash = CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);
  return hash;
}

export function verifyUrlToken(
  token: string,
  digestToken: string,
  salt: string | null,
) {
  const hashedToken = hashUrlToken(token, salt);
  return hashedToken === digestToken;
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function fallbackInitials(name: string) {
  return name
    .split(" ")
    .map((point) => point[0])
    .join("");
}

export function formatPermission(role: string): string {
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export const closeWindow = `
<html>
      <body>
        <script>
          window.close();
        </script>
        <p>Window is closing...</p>
        <p>If not close, please close it manually</p>
      </body>
    </html>
`;

export function successResponse<T>(c: Context, data: T) {
  return c.json(
    {
      success: true,
      data,
    },
    StatusCodes.OK,
  );
}

export function errorResponse(c: Context, error: unknown) {
  return c.json(
    {
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    },
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}

export function parsedJSON<T>(data: unknown): T {
  return superjson.parse<T>(superjson.stringify(data));
}

export function hexToRgba(hex: string, opacity: number) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const factory = createFactory<APIBindings>();

export function actionResponse<T>(success: boolean, intent?: string, data?: T) {
  return {
    success,
    intent,
    data,
  };
}
