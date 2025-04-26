import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import { formatDistanceToNow } from "date-fns";

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
      </body>
    </html>
`;
