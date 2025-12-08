import { Button } from "@binspire/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import type { Column } from "@tanstack/react-table";
import { EyeOff } from "lucide-react";
import { parseAsJson, useQueryState } from "nuqs";
import { type ComponentProps, useCallback } from "react";
import z from "zod";

export const SortSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  }),
);

type SortingButtonProps<T> = {
  label?: string;
  column: Column<T, unknown>;
  icons: {
    asc: React.ReactNode;
    desc: React.ReactNode;
    default: React.ReactNode;
  };
  menuLabels: {
    asc: string;
    desc: string;
  };
} & ComponentProps<"button">;

export function SortingButton<T>({
  label,
  column,
  icons,
  menuLabels,
  ...props
}: SortingButtonProps<T>) {
  const [, setSort] = useQueryState(
    "sort",
    parseAsJson(SortSchema).withDefault([]),
  );

  const sorted = column.getIsSorted();

  const handleSorting = useCallback(
    (desc: boolean) => {
      setSort([{ id: column.id, desc }]);
    },
    [column.id, setSort],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 ml-[-0.8rem] ${props.className ?? ""}`}
          onClick={() => handleSorting(sorted !== "asc")}
          {...props}
        >
          {label}
          {sorted === "asc"
            ? icons.asc
            : sorted === "desc"
              ? icons.desc
              : icons.default}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-mt-1">
        <DropdownMenuItem onClick={() => handleSorting(false)}>
          {icons.asc}
          {menuLabels.asc}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSorting(true)}>
          {icons.desc}
          {menuLabels.desc}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeOff className="mr-2 h-4 w-4" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
