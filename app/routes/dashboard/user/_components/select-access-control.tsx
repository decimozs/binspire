import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AccessControlSelectProps {
  selectedAccess: string;
  setSelectedAccess: (value: string) => void;
}

export default function SelectAccessControl({
  selectedAccess,
  setSelectedAccess,
}: AccessControlSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Access Control</p>
      <Select
        value={selectedAccess}
        onValueChange={(value) => {
          setSelectedAccess(value);
        }}
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
