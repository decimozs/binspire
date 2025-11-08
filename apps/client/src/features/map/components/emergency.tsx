import { Button } from "@binspire/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { PhoneCall } from "lucide-react";

export default function Emergency() {
  const emergencyNumber = "+1234567890";

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive" className="z-50">
          <PhoneCall />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">
            Need for a help
          </DrawerTitle>
          <DrawerDescription>
            In case of emergency, use this to contact emergency services.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <a href={`tel:${emergencyNumber}`} className="w-full">
            <Button className="font-bold text-lg w-full" variant="destructive">
              Call
            </Button>
          </a>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
