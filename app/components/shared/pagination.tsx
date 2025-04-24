import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  className?: string;
  onPageChange: (newPage: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  totalResults,
  className,
  onPageChange,
}: Props) {
  return (
    <div
      className={`flex flex-row items-center justify-between w-full ${className}`}
    >
      <p className="text-sm text-muted-foreground">{totalResults} Results</p>
      {totalPages > 1 && (
        <div className="flex flex-row items-center gap-2">
          <p className="mr-4 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight />
          </Button>
        </div>
      )}
    </div>
  );
}
