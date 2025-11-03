import { useEffect, useRef, useState } from "react";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { QRCodeSVG } from "qrcode.react";
import { authClient } from "@/lib/auth-client";
import {
  useCreateQRCode,
  useGetOrganizationSettingsById,
} from "@binspire/query";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { encryptWithSecret, generateRandomValue } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ShowToast } from "@/components/core/toast-notification";
import { usePermissionStore } from "@/store/permission-store";

interface Props {
  label?: string;
}

export default function GenerateQRCode({ label = "Generate QR Code" }: Props) {
  const { permission } = usePermissionStore();
  const qrRef = useRef<SVGSVGElement | null>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const { data: session } = authClient.useSession();
  const orgSettings = useGetOrganizationSettingsById(session?.user.orgId!);
  const createQRCode = useCreateQRCode();
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const secret = orgSettings.data?.secret;
  const hasPermission = permission.settingsManagement?.actions.update;

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
    const initQr = async () => {
      if (!secret || !logoBase64) return;
      const randomValue = generateRandomValue();
      const encrypted = await encryptWithSecret(secret, randomValue);
      setQrValue(encrypted);
    };
    initQr();
  }, [secret, logoBase64]);

  const handleGenerateNew = async () => {
    if (!secret) return;
    const value = generateRandomValue();
    const encrypted = await encryptWithSecret(secret, value);
    setQrValue(encrypted);
  };

  const handleDownloadPNG = async () => {
    const svg = qrRef.current;
    if (!svg || !secret) return;

    try {
      const value = generateRandomValue();
      const encrypted = await encryptWithSecret(secret, value);

      await createQRCode.mutateAsync({
        data: { secret: value },
      });

      setQrValue(encrypted);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const updatedSvg = qrRef.current;
      if (!updatedSvg) throw new Error("QR code not rendered yet");

      const svgData = new XMLSerializer().serializeToString(updatedSvg);
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

  if (orgSettings.isPending || !secret || !logoBase64 || !qrValue) {
    return <Skeleton className="h-[256px] w-full rounded-2xl" />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="secondary"
          type="button"
          className="w-full"
          disabled={!hasPermission}
        >
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription>
            Generate and download a scannable QR code for convenient access.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow overflow-hidden inline-block">
            <QRCodeSVG
              key={qrValue}
              ref={qrRef}
              value={qrValue}
              size={256}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin
              imageSettings={{
                src: logoBase64,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateNew}
              disabled={createQRCode.isPending}
            >
              Generate New QR
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPNG}
              disabled={createQRCode.isPending}
            >
              {createQRCode.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Download"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
