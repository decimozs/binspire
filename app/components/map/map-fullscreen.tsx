import { Fullscreen, Maximize, Minimize } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function MapFullscreen() {
  const [isFullscreen, setFullscreen] = useState(false);
  const handleFullscreen = () => {
    const elem = document.documentElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setFullscreen(false);
    }
  };

  return (
    <Button variant="secondary" size="icon" onClick={handleFullscreen}>
      {!isFullscreen ? <Maximize /> : <Minimize />}
    </Button>
  );
}
