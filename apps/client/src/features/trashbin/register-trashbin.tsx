import { QRCodeApi, useGetOrganizationSettingsById } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, FileUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { ShowToast } from "@/components/toast";
import { authClient } from "@/features/auth";
import { decryptWithSecret } from "@/lib/utils";

export default function RegisterTrashbin() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const orgSettings = useGetOrganizationSettingsById(session?.user.orgId!);
  const secret = orgSettings.data?.secret;

  const qrRegionId = "qr-reader";
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [shouldStartCamera, setShouldStartCamera] = useState(false);

  useEffect(() => {
    return () => {
      stopCameraScan();
    };
  }, []);

  useEffect(() => {
    if (shouldStartCamera && qrContainerRef.current) {
      initCamera();
      setShouldStartCamera(false);
    }
  }, [shouldStartCamera]);

  const startCameraScan = async () => {
    setIsScanning(true);
    setShouldStartCamera(true);
  };

  const initCamera = async () => {
    try {
      const element = qrContainerRef.current;
      if (!element) throw new Error("QR container not found in DOM");

      html5QrCodeRef.current = new Html5Qrcode(qrRegionId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0)
        throw new Error("No camera found on this device.");

      const camera =
        devices.find(
          (d) =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("environment"),
        ) || devices[0];

      await html5QrCodeRef.current.start(
        camera.id,
        { fps: 10 },
        async (decodedText) => {
          await handleVerification(decodedText);
          stopCameraScan();
        },
        (error) => console.warn("QR scan error:", error),
      );
    } catch (err: any) {
      const message =
        err?.name === "NotAllowedError" || err?.message?.includes("denied")
          ? "Camera permission denied. Please allow camera access."
          : err?.message || "Failed to start camera scan.";
      ShowToast("error", message);
      setIsScanning(false);
    }
  };

  const stopCameraScan = async () => {
    setIsScanning(false);
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Error stopping camera:", err);
      }
      html5QrCodeRef.current = null;
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tempDivId = "temp-reader";
    let tempDiv = document.getElementById(tempDivId);
    if (!tempDiv) {
      tempDiv = document.createElement("div");
      tempDiv.id = tempDivId;
      tempDiv.style.display = "none";
      document.body.appendChild(tempDiv);
    }

    try {
      const html5QrCode = new Html5Qrcode(tempDivId);
      const result = await html5QrCode.scanFile(file, true);
      await handleVerification(result);
      await html5QrCode.clear();
    } catch (err: any) {
      const message = "Failed to scan image: " + err.message;
      ShowToast("error", message);
    } finally {
      event.target.value = "";
    }
  };

  const handleVerification = async (decodedText: string) => {
    try {
      if (!secret) throw new Error("Missing organization secret.");

      const decrypted = await decryptWithSecret(secret, decodedText);

      if (!decrypted) throw new Error("Invalid QR code.");

      const isSecretExisting = await QRCodeApi.getBySecret(decrypted);
      if ("status" in isSecretExisting && isSecretExisting.status === false) {
        ShowToast("error", "QR code not found or already used.");
        return;
      }

      navigate({ to: "/create-trashbin", search: { secret: decrypted } });
    } catch (err: any) {
      ShowToast("error", err.message || "QR Code verification failed.");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4">
        {!isScanning ? (
          <>
            <button
              onClick={startCameraScan}
              className="border-muted border-[1px] rounded-md p-4 cursor-pointer bg-muted text-left"
            >
              <div className="grid grid-cols-[30px_1fr] gap-4">
                <Camera size={30} className="text-primary" />
                <p className="text-xl font-bold">Scan with Camera</p>
              </div>
            </button>

            <button
              className="border-muted border-[1px] rounded-md p-4 cursor-pointer bg-muted text-left"
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="grid grid-cols-[30px_1fr] gap-4">
                <FileUpIcon size={30} className="text-primary" />
                <p className="text-xl font-bold">Upload QR</p>
              </div>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div
              ref={qrContainerRef}
              id={qrRegionId}
              className="w-full h-[300px] bg-black/70 rounded-lg overflow-hidden flex items-center justify-center"
            >
              <p className="text-muted-foreground">Initializing camera...</p>
            </div>

            <div className="w-full">
              <Button
                variant="destructive"
                size="lg"
                onClick={stopCameraScan}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
