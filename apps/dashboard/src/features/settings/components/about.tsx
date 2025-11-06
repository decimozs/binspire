import SettingsLayout from "@/components/layout/settings-layout";
import lastUpdated from "@/last-updated.txt?raw";

export default function AboutSettings() {
  return (
    <SettingsLayout
      label="About"
      description="View system details including version, health status, updates, developer info, and license."
    >
      <div className="grid grid-cols-[120px_1fr] md:w-md">
        <div className="flex flex-col gap-2">
          <p>Version</p>
          <p>System Health</p>
          <p>Last Update</p>
          <p>Developed By</p>
          <p>Contact</p>
          <p>License</p>
        </div>
        <div className="text-right text-muted-foreground flex flex-col gap-2">
          <p>2.0.0</p>
          <div className="flex flex-row items-center gap-2 justify-end">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
            </span>
            <p>Good</p>
          </div>
          <p>{lastUpdated}</p>
          <p>Binspire</p>
          <a href="mailto:contact.binspire@gmail.com">
            contact.binspire@gmail.com
          </a>
          <p>MIT License</p>
        </div>
      </div>
    </SettingsLayout>
  );
}
