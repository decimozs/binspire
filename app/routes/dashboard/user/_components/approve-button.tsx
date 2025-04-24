import { useFetcher, type FetcherWithComponents } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApproveRequestFormProps {
  requestId: string;
  email: string;
  selectedAccess: string;
  fetcher: FetcherWithComponents<any>;
}

export function ApproveButton({
  requestId,
  email,
  selectedAccess,
  fetcher,
}: ApproveRequestFormProps) {
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="approved" />
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="access-control" value={selectedAccess} />
      <Button type="submit" disabled={fetcher.state !== "idle"}>
        {fetcher.state === "submitting" && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {fetcher.state === "submitting" ? "Approving..." : "Approve"}
      </Button>
    </fetcher.Form>
  );
}
