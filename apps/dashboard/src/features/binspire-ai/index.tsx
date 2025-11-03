import { Button } from "@binspire/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Sparkle } from "lucide-react";

export default function BinspireAI() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Sparkle />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Binspire AI</SheetTitle>
          <SheetDescription>
            Hello from Binspire AI! How can I assist you today?
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
