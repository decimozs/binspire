import { Button } from "@binspire/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function Back() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: "/" });
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleBack}
      className="border-[1px] border-primary h-12"
    >
      <ArrowLeft />
    </Button>
  );
}
