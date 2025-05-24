import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function PrivacySettings() {
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Allow anonymous telemetry</span>
        <Switch
          checked={telemetryEnabled}
          onCheckedChange={setTelemetryEnabled}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Allow usage data sharing</span>
        <Switch
          checked={dataSharingEnabled}
          onCheckedChange={setDataSharingEnabled}
        />
      </div>
    </div>
  );
}
