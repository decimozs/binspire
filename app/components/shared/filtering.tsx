import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { useFilteringStore } from "@/store/filtering.store";
import { toast } from "sonner";

function ToastFilter() {
  const { setFiltering } = useFilteringStore();

  const handleResetFilter = () => {
    toast.dismiss();
    setFiltering(false);
    const urlWithoutQueryParams =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({}, "", urlWithoutQueryParams);
  };

  return (
    <div className="ml-11 flex items-center gap-2 justify-between bg-background p-2 rounded-md border border-input w-[300px]">
      <Button variant="outline" size="icon">
        <SlidersHorizontal />
      </Button>
      <div className="border-input border rounded-md w-full h-[35px] flex items-center justify-center">
        <p className="text-sm">Filtering Data</p>
      </div>
      <Button size="icon" onClick={handleResetFilter}>
        <X />
      </Button>
    </div>
  );
}

export default function Filtering() {
  const { isFiltering } = useFilteringStore();
  const toastIdRef = useRef<number | string | null>(null);

  useEffect(() => {
    if (isFiltering && !toastIdRef.current) {
      const id = toast.custom(() => <ToastFilter />, {
        position: "bottom-center",
        duration: Infinity,
      });
      toastIdRef.current = id;
    }

    if (!isFiltering && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [isFiltering]);
}
