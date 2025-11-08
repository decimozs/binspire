import "@google/model-viewer";
import { Layers2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Button } from "@binspire/ui/components/button";

export default function MapLegend() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <Layers2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/30"
      >
        <p className="mb-2 mt-1 font-medium text-center">Legend</p>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2 pr-3 mt-3 mb-2 font-bold">
          <div className="grid grid-cols-[40px_1fr] items-center gap-4">
            {/* @ts-ignore: model-viewer is a custom element */}
            <model-viewer
              src="/models/bin.glb"
              alt="3D Trash Bin"
              auto-rotate
              interaction-prompt="none"
              style={{
                width: "50px",
                height: "50px",
                "--poster-color": "transparent",
              }}
            />
            <div className="flex flex-col gap-2">
              <p className="text-[0.9rem] green-badge w-full text-center">
                Empty
              </p>
              <p className="text-[0.9rem] green-badge w-full text-center">
                Low
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[40px_1fr] items-center gap-4">
            {/* @ts-ignore: model-viewer is a custom element */}
            <model-viewer
              src="/models/almost-full.glb"
              alt="3D Trash Bin"
              auto-rotate
              interaction-prompt="none"
              style={{
                width: "50px",
                height: "50px",
                "--poster-color": "transparent",
              }}
            />
            <p className="text-[0.9rem] yellow-badge  w-full text-center">
              Almost Full
            </p>
          </div>
          <div className="grid grid-cols-[40px_1fr] items-center gap-4">
            {/* @ts-ignore: model-viewer is a custom element */}
            <model-viewer
              src="/models/full.glb"
              alt="3D Trash Bin"
              auto-rotate
              interaction-prompt="none"
              style={{
                width: "50px",
                height: "50px",
                "--poster-color": "transparent",
              }}
            />
            <p className="text-[0.9rem] orange-badge  w-full text-center">
              Full
            </p>
          </div>
          <div className="grid grid-cols-[40px_1fr] items-center gap-4">
            {/* @ts-ignore: model-viewer is a custom element */}
            <model-viewer
              src="/models/overflowing.glb"
              alt="3D Trash Bin"
              auto-rotate
              interaction-prompt="none"
              style={{
                width: "50px",
                height: "50px",
                "--poster-color": "transparent",
              }}
            />
            <p className="text-[0.9rem] red-badge  w-full text-center">
              Overflowing
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
