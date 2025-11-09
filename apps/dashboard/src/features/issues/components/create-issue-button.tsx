import { Button } from "@binspire/ui/components/button";
import { useLocation } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function CreateIssueButton() {
  const location = useLocation();
  const [, setCreateIssue] = useQueryState(
    "is_creating_issue",
    parseAsBoolean.withDefault(false),
  );

  if (location.pathname !== "/issues") return null;

  const handleCreateIssue = () => {
    setCreateIssue(true);
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleCreateIssue}
      className="font-bold"
    >
      <Ticket />
      New Issue
    </Button>
  );
}
