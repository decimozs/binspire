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
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { useLocation } from "@tanstack/react-router";
import type { Table } from "@tanstack/react-table";
import { Download, Loader2 } from "lucide-react";
import * as React from "react";
import z from "zod";
import { exportToCSV } from "@/lib/export";

interface ExportButtonProps<T> {
  table: Table<T>;
}

const exportFormSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
});

export default function ExportButton<T>({ table }: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = React.useState(false);
  const { pathname } = useLocation();
  const now = new Date();
  const dateTime = now
    .toLocaleString("sv-SE", { hour12: false })
    .replace(" ", "_")
    .replace(/:/g, "-");

  const form = useForm({
    defaultValues: {
      filename: `${pathname.replace("/", "")}-data-export-${dateTime}`,
    },
    validators: {
      onSubmit: exportFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setIsExporting(true);

      const filename = value.filename.endsWith(".csv")
        ? value.filename
        : `${value.filename}.csv`;

      await new Promise((resolve) => {
        exportToCSV(
          table.getFilteredRowModel().rows.map((row) => row.original),
          filename,
        );
        setTimeout(resolve, 600); // small delay to show loading state
      });

      setIsExporting(false);
      formApi.reset();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Table Data</DialogTitle>
          <DialogDescription>
            Your table data will be exported as a <b>CSV file</b>. All visible
            rows and columns will be included in the export.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2">
            <p>Filename</p>
            <form.Field name="filename">
              {(field) => (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your filename"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p className="absolute top-0 right-4 text-muted-foreground translate-y-1/2">
                    {".csv"}
                  </p>
                  <FormFieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" type="submit" disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Export"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
