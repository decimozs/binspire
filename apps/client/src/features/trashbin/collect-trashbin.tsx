import { Button } from "@binspire/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { Camera, FileUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "../auth";
import {
  TrashbinApi,
  useCollectTrashbin,
  useGetOrganizationSettingsById,
  useGetTrashbinById,
  useGetUserQuotaByUserId,
  useUpdateUserQuota,
} from "@binspire/query";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ShowToast } from "@/components/toast";
import { decryptWithSecret } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useMqtt } from "@/context/mqtt-provider";
import { useMap } from "react-map-gl/maplibre";
import { useTrashbinLogsStore } from "@/store/trashbin-logs-store";
import { useRouteStore } from "@/store/route-store";

export default function CollectTrashbin() {
  const [trashbinId, setTrashbinId] = useQueryState("trashbin_id");
  const [markTrashbinId, setMarkTrashbinId] = useQueryState("mark_trashbin_id");
  const { data: trashbin } = useGetTrashbinById(trashbinId || "");
  const [, setLat] = useQueryState("lat");
  const [, setLng] = useQueryState("lng");
  const { resetLogs } = useTrashbinLogsStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: session } = authClient.useSession();
  const orgSettings = useGetOrganizationSettingsById(session?.user.orgId!);
  const [open, setOpen] = useState(false);
  const secret = orgSettings.data?.secret;
  const qrRegionId = "qr-reader";
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const bins = useTrashbinRealtime((state) => state.bins);
  const userQuota = useGetUserQuotaByUserId(session?.user.id!);
  const collectAction = useCollectTrashbin();
  const quotaAction = useUpdateUserQuota();
  const { client } = useMqtt();
  const { current: map } = useMap();
  const [isVerifying, setIsVerifying] = useState(false);
  const { route, deleteRoute } = useRouteStore();

  const scannedQRCodes = useRef(new Set<string>());

  const {
    wasteLevel = 0,
    weightLevel = 0,
    batteryLevel = 0,
  } = bins[trashbinId!] ?? {};

  useEffect(() => {
    return () => {
      stopCameraScan();
    };
  }, []);

  useEffect(() => {
    if (isScanning && qrContainerRef.current && !html5QrCodeRef.current) {
      initCamera();
    }
  });

  const startCameraScan = () => {
    setIsScanning(true);
    scannedQRCodes.current.clear();
  };

  const initCamera = async () => {
    try {
      if (html5QrCodeRef.current) return;

      const element = qrContainerRef.current;
      if (!element) throw new Error("QR container not found");

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
          if (scannedQRCodes.current.has(decodedText)) return;
          scannedQRCodes.current.add(decodedText);

          await handleVerification(decodedText);
          await stopCameraScan();
        },
        (error) => console.warn("QR scan error:", error),
      );
    } catch (err: any) {
      ShowToast(
        "error",
        err?.name === "NotAllowedError" || err?.message?.includes("denied")
          ? "Camera permission denied. Please allow camera access."
          : err?.message || "Failed to start camera scan.",
      );
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
      if (!scannedQRCodes.current.has(result)) {
        scannedQRCodes.current.add(result);
        await handleVerification(result);
      }
      await html5QrCode.clear();
    } catch (err: any) {
      ShowToast("error", "Failed to scan image: " + err.message);
    } finally {
      event.target.value = "";
    }
  };

  const handleVerification = async (decodedText: string) => {
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      if (!secret) throw new Error("Missing organization secret.");

      const decrypted = await decryptWithSecret(secret, decodedText);

      if (!decrypted) throw new Error("Invalid QR code.");

      if (!trashbinId) {
        if (markTrashbinId !== decrypted) {
          ShowToast("error", "QR Code does not match the trashbin ID.");
          return;
        }
      } else {
        if (trashbinId !== decrypted) {
          ShowToast("error", "QR Code does not match the trashbin ID.");
          return;
        }
      }

      const isSecretExisting = await TrashbinApi.getById(decrypted);

      if (!isSecretExisting) {
        ShowToast("error", "QR code not found or already used.");
        return;
      }

      const collect = await collectAction.mutateAsync({
        id: decrypted,
        data: { wasteLevel, weightLevel, batteryLevel },
      });

      if (!collect) throw new Error("Failed to collect trashbin data.");

      const newQuota = await quotaAction.mutateAsync({
        userId: session?.user.id!,
        data: { used: userQuota.data?.used! + 1 },
      });

      if (!newQuota) throw new Error("Failed to update user quota.");

      client?.publish(
        `trashbin/${decrypted}/waste_level`,
        JSON.stringify({ wasteLevel: 53, timestamp: new Date().toISOString() }),
      );

      client?.publish(
        `trashbin/${decrypted}/weight_level`,
        JSON.stringify({ weightLevel: 0, timestamp: new Date().toISOString() }),
      );

      client?.publish(
        "trashbin/collection",
        JSON.stringify({
          trashbinId: decrypted,
          name: trashbin?.name,
          location: trashbin?.location,
          key: "collectionsManagement_actionDialog",
          url: {
            type: "collectionsManagement",
            id: collect.id,
            action: ["view"],
          },
        }),
      );

      setTrashbinId(null);
      setLat(null);
      setLng(null);
      setOpen(false);
      resetLogs(decrypted);

      if (route) {
        deleteRoute();
        setMarkTrashbinId(null);
        ShowToast("success", "Trashbin collected successfully!");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        ShowToast("info", "Cleaning up navigation session...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload();
        return;
      }

      if (map && orgSettings.data?.settings?.general?.location) {
        map.flyTo({
          center: [
            orgSettings.data?.settings?.general?.location.lng!,
            orgSettings.data?.settings?.general?.location.lat!,
          ],
          zoom: 16.5,
          pitch: 70,
          bearing: 10,
          padding: { bottom: 0 },
          essential: true,
        });
      }

      ShowToast("success", "Trashbin collected successfully!");
    } catch (err: any) {
      ShowToast("error", err.message || "QR Code verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full font-bold text-xl">Collect</Button>
      </SheetTrigger>

      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl">Collect Trashbin</SheetTitle>
          <SheetDescription>
            Choose a method to collect data from the trashbin.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 text-xl grid grid-cols-1 gap-2">
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
            <div
              ref={qrContainerRef}
              id={qrRegionId}
              className="w-full h-[300px] bg-black/70 rounded-lg overflow-hidden flex items-center justify-center"
            >
              <p className="text-muted-foreground font-bold">
                Initializing camera...
              </p>
            </div>
          )}
        </div>

        <SheetFooter>
          {!isScanning ? (
            <SheetClose asChild>
              <Button variant="secondary" className="w-full font-bold text-xl">
                Cancel
              </Button>
            </SheetClose>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={stopCameraScan}
              className="w-full font-bold text-xl"
            >
              Cancel
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
