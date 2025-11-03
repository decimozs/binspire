import { Button } from "@binspire/ui/components/button";
import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useGetOrganizationSettingsById } from "@binspire/query";
import { encryptWithSecret } from "@/lib/utils";
import { ShowToast } from "./toast-notification";

export default function ShowQrCode({ id }: { id: string }) {
  const qrRef = useRef<SVGSVGElement | null>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  const orgSettings = useGetOrganizationSettingsById(session?.user.orgId!);
  const secret = orgSettings.data?.secret;

  useEffect(() => {
    const loadLogo = async () => {
      const response = await fetch("/favicon.ico");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result as string);
      reader.readAsDataURL(blob);
    };
    loadLogo();
  }, []);

  useEffect(() => {
    const encryptId = async () => {
      if (!secret) return;

      try {
        const encrypted = await encryptWithSecret(secret, id);
        setQrValue(encrypted);
      } catch (err) {
        ShowToast("error", "Failed to encrypt QR code");
      }
    };
    encryptId();
  }, [secret, id]);

  const handleDownloadPNG = async () => {
    const svg = qrRef.current;

    if (!svg) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngFile;
        link.download = "qrcode.png";
        link.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
      ShowToast("success", "QR Code generated successfully");
    } catch (err: any) {
      ShowToast("error", err.message || "Failed to generate QR Code");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[380px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Encrypted ID QR Code</DialogDescription>
        </DialogHeader>
        <div className="px-4 flex items-center justify-center">
          <div className="p-3 bg-white rounded-2xl shadow overflow-hidden inline-block">
            <p className="text-background font-bold text-center break-all">
              TRASHBIN
            </p>
            {qrValue && (
              <QRCodeSVG
                ref={qrRef}
                value={qrValue}
                size={256}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin
                imageSettings={
                  logoBase64
                    ? {
                        src: logoBase64,
                        height: 28,
                        width: 28,
                        excavate: true,
                      }
                    : undefined
                }
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={handleDownloadPNG} disabled={!qrValue}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
