import { TriangleAlert } from "lucide-react";

interface WarningSignProps {
  message?: string;
  className?: string;
  iconSize?: number;
  iconClassName?: string;
}

export default function WarningSign({
  message = "This section is not available. If you need to make changes, please contact your system administrator.",
  className,
  iconSize,
  iconClassName,
}: WarningSignProps) {
  return (
    <div
      className={`grid grid-cols-[25px_1fr] border-[1px] rounded-md border-yellow-400/20 bg-yellow-400/10 p-4 text-yellow-600 font-medium w-fit gap-2 w-full ${className}`}
    >
      <TriangleAlert className={`${iconClassName}`} size={iconSize} />
      <p>{message}</p>
    </div>
  );
}
