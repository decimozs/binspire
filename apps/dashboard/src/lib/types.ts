import type { DialogPrimitive } from "@binspire/ui/components/dialog";
import type { ComponentProps } from "react";

export type DialogProps<T> = ComponentProps<typeof DialogPrimitive.Root> &
  ComponentProps<"button"> & { action: T };
