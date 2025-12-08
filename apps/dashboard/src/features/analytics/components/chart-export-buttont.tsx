import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { exportToCSV } from "@/lib/export";

interface ChartExportButtonProps<T> {
  data: T[];
}

export default function ChartExportButton<T>({
  data,
}: ChartExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const [filename, setFilename] = useState("data-export");

  async function handleExport() {
    setIsExporting(true);

    const finalName = filename.endsWith(".csv") ? filename : `${filename}.csv`;

    await new Promise((resolve) => {
      exportToCSV(data, finalName);
      setTimeout(resolve, 600);
    });

    setIsExporting(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="font-bold">
          <Download />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            The chart’s data will be exported as a <b>CSV file</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <p>Filename</p>
          <Input
            type="text"
            placeholder="Enter your filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">.csv</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={isExporting}>
              Cancel
            </Button>
          </DialogClose>
          <Button size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Export"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
