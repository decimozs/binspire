import { authClient } from "@/lib/auth-client";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { useEffect, useState } from "react";

export default function Welcome() {
  const [open, setOpen] = useState(false);
  const { data: current } = authClient.useSession();

  useEffect(() => {
    const hasDismissed = localStorage.getItem("welcome_banner_dismissed");

    if (!hasDismissed) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("welcome_banner_dismissed", "true");
  };

  const handleDocs = () => {
    window.open("https://binspire.com/docs", "_blank");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger hidden>Open</DialogTrigger>
      <DialogContent overlayOpacity={90}>
        <DialogHeader>
          <div className="flex flex-row items-center gap-2">
            <img
              src="/favicon.ico"
              alt="Binspire"
              className="rounded-md size-5"
            />
            <DialogTitle>Welcome to Binspire, {current?.user.name}</DialogTitle>
          </div>
          <DialogDescription>
            Smarter waste management starts here. Binspire helps you understand
            your data, make better decisions, and create lasting change for a
            cleaner, more sustainable world.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleDocs}>
            Docs
          </Button>
          <Button size="sm" onClick={handleClose}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
