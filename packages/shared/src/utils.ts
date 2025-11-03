import { format, formatDistanceToNow } from "date-fns";
import { TRASHBIN_CONFIG } from "./constants";

export function getInitial(name?: string) {
  return name ? name?.trim()[0]?.toUpperCase() : "";
}

export function toTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export function formatCamelCase(str: string) {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMMM dd, yyyy • h:mm a");
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getDiff<T extends object>(prev: T, next: T) {
  return Object.keys(next).reduce(
    (acc, key) => {
      if (prev[key as keyof T] !== next[key as keyof T]) {
        acc[key as keyof T] = {
          from: prev[key as keyof T],
          to: next[key as keyof T],
        };
      }
      return acc;
    },
    {} as Record<keyof T, { from: any; to: any }>,
  );
}

export function formatLabel(str: string): string {
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getStatus(
  value: number,
  type: keyof typeof TRASHBIN_CONFIG,
): keyof (typeof TRASHBIN_CONFIG)[typeof type] {
  const statuses = TRASHBIN_CONFIG[type];
  let result = Object.keys(statuses)[0] as keyof typeof statuses;

  for (const [status, { value: threshold }] of Object.entries(statuses)) {
    if (value >= threshold) {
      result = status as keyof typeof statuses;
    }
  }

  return result;
}
