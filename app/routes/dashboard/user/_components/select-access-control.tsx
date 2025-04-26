import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface AccessControlSelectProps {
  selectedAccess: string;
  setSelectedAccess?: (value: string) => void;
  title?: string;
  disabled?: boolean;
}

export default function SelectAccessControl({
  selectedAccess,
  setSelectedAccess,
  title = "Access Control",
  disabled,
}: AccessControlSelectProps) {
  const handleValueChange = (value: string) => {
    if (setSelectedAccess) {
      setSelectedAccess(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{title}</p>
      <Select
        value={selectedAccess}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Viewer (Default)" />
        </SelectTrigger>
        <SelectContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectItem value="viewer">Viewer</SelectItem>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Can only view content and data. Cannot make any changes.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectItem value="editor">Editor</SelectItem>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>
                  Can view and edit content, but cannot manage users or
                  permissions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectItem value="full-access">Full Access</SelectItem>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>
                  Has complete access to manage content, users, and settings.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SelectContent>
      </Select>
    </div>
  );
}
