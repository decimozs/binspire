import { useSession } from "@/features/auth";
import { Button } from "@binspire/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function Welcome() {
  const { data: current } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const hasDismissed = localStorage.getItem(
      "client_welcome_banner_dismissed",
    );

    if (hasDismissed) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  const handleClose = () => {
    localStorage.setItem("client_welcome_banner_dismissed", "true");
    navigate({ to: "/" });
  };

  const handleDocs = () => {
    handleClose();
    window.open("https://binspire.com/docs", "_blank");
  };

  if (!current?.user) return null;

  return (
    <main className="p-4">
      <div>
        <img
          src="/favicon.ico"
          alt="Binspire"
          className="size-13 rounded-md mb-4"
        />
        <p className="font-bold text-4xl">
          Welcome to <br /> Binspire,{" "}
          <span className="text-primary">{current.user.name}</span>!
        </p>
        <p className="text-3xl text-muted-foreground font-bold mt-8">
          Smarter waste collection starts here. Binspire empowers maintenance
          teams and waste collectors to track, manage, and optimize every
          pickup, helping you keep communities cleaner, safer, and more
          sustainable every day.
        </p>
      </div>
      <div className="fixed bottom-4 right-4 flex flex-row items-center gap-2">
        <Button variant="outline" onClick={handleDocs}>
          Docs
        </Button>
        <Button onClick={handleClose}>Get Started</Button>
      </div>
    </main>
  );
}
