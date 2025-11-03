import { useQueryClient } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";

interface RefreshButtonProps {
  queryKey: string | unknown[];
}

export default function RefreshButton({ queryKey }: RefreshButtonProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      });
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  return (
    <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </>
      )}
    </Button>
  );
}
