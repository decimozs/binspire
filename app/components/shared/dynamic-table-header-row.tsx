import { TableHead, TableRow } from "../ui/table";
import type { LucideIcon } from "lucide-react";

interface TableColumn {
  label: string;
  icon?: LucideIcon;
  alignRight?: boolean;
}

type TableHeaderProps = {
  columns: TableColumn[];
};

export default function DynamicTableHeaderRow({ columns }: TableHeaderProps) {
  return (
    <TableRow>
      {columns.map((col, index) => (
        <TableHead key={index} className={col.alignRight ? "text-right" : ""}>
          {col.icon ? (
            <span className="flex flex-row gap-1 items-center">
              <col.icon size={15} className="mt-[0.1rem]" />
              {col.label}
            </span>
          ) : (
            col.label
          )}
        </TableHead>
      ))}
    </TableRow>
  );
}
