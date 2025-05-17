import { Loader2 } from "lucide-react";

export default function Loading({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 size={35} className="animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
