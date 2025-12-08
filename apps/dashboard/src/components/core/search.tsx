import { Button } from "@binspire/ui/components/button";
import { cn } from "@binspire/ui/lib/utils";
import { useSearch } from "@/context/search-provider";

type SearchProps = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
};

export function Search({ className = "" }: SearchProps) {
  const { setOpen } = useSearch();

  const handleToggleSearch = () => {
    setOpen(true);
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "bg-muted/25 group text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none w-[140px]",
        className,
      )}
      onClick={handleToggleSearch}
    >
      Command
      <kbd className="bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
